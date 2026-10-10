import Foundation
import Capacitor

/// TypeMonkey progress in iCloud: a few small strings in the iCloud key-value store
/// (NSUbiquitousKeyValueStore, up to 1 MB). No server and no account of ours: Apple syncs it between
/// the player's own devices signed in to the same Apple Account. Used from JavaScript as Capacitor.Plugins.TMCloud.
@objc(TMCloudPlugin)
public class TMCloudPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "TMCloudPlugin"
    public let jsName = "TMCloud"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "available", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "get", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "set", returnType: CAPPluginReturnPromise)
    ]

    private let store = NSUbiquitousKeyValueStore.default
    private var observer: NSObjectProtocol?

    override public func load() {
        // Another device (or iCloud at launch) delivered new values: tell the web app so it can merge them.
        observer = NotificationCenter.default.addObserver(
            forName: NSUbiquitousKeyValueStore.didChangeExternallyNotification, object: store, queue: .main
        ) { [weak self] note in
            let keys = note.userInfo?[NSUbiquitousKeyValueStoreChangedKeysKey] as? [String] ?? []
            let reason = note.userInfo?[NSUbiquitousKeyValueStoreChangeReasonKey] as? Int ?? -1
            self?.notifyListeners("changed", data: ["keys": keys, "reason": reason])
        }
        store.synchronize()
    }

    deinit {
        if let observer = observer { NotificationCenter.default.removeObserver(observer) }
    }

    /// Is the player signed in to iCloud on this device?
    @objc func available(_ call: CAPPluginCall) {
        call.resolve(["available": FileManager.default.ubiquityIdentityToken != nil])
    }

    @objc func get(_ call: CAPPluginCall) {
        guard let key = call.getString("key") else { call.reject("key is required"); return }
        if let value = store.string(forKey: key) {
            call.resolve(["value": value])
        } else {
            call.resolve([:])
        }
    }

    @objc func set(_ call: CAPPluginCall) {
        guard let key = call.getString("key"), let value = call.getString("value") else {
            call.reject("key and value are required"); return
        }
        store.set(value, forKey: key)
        store.synchronize()
        call.resolve()
    }
}
