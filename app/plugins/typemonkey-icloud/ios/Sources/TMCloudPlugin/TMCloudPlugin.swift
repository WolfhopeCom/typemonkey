import Foundation
import Capacitor
import StoreKit
import UIKit

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
        CAPPluginMethod(name: "set", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "localGet", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "localSet", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "requestReview", returnType: CAPPluginReturnPromise)
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

    /// A safety copy of progress on this device (UserDefaults). The web view's own storage is "best effort" on iOS
    /// and can be cleared by the system; this copy is not, so the app can restore progress if that happens.
    @objc func localGet(_ call: CAPPluginCall) {
        guard let key = call.getString("key") else { call.reject("key is required"); return }
        if let value = UserDefaults.standard.string(forKey: "tm.local." + key) {
            call.resolve(["value": value])
        } else {
            call.resolve([:])
        }
    }

    @objc func localSet(_ call: CAPPluginCall) {
        guard let key = call.getString("key"), let value = call.getString("value") else {
            call.reject("key and value are required"); return
        }
        UserDefaults.standard.set(value, forKey: "tm.local." + key)
        call.resolve()
    }

    /// Apple's own "Enjoying TypeMonkey?" rating prompt. iOS decides whether it actually appears
    /// (at most 3 times a year), so the web app only asks after a happy moment.
    @objc func requestReview(_ call: CAPPluginCall) {
        Task { @MainActor in
            if let scene = UIApplication.shared.connectedScenes
                .first(where: { $0.activationState == .foregroundActive }) as? UIWindowScene {
                if #available(iOS 16.0, *) {
                    AppStore.requestReview(in: scene)
                } else {
                    SKStoreReviewController.requestReview(in: scene)
                }
            }
            call.resolve()
        }
    }
}
