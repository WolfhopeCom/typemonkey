// swift-tools-version: 5.9
// Used when the iOS project is built with Swift Package Manager instead of CocoaPods.
import PackageDescription

let package = Package(
    name: "TypemonkeyIcloud",
    platforms: [.iOS(.v15)],
    products: [
        .library(name: "TypemonkeyIcloud", targets: ["TMCloudPlugin"])
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", from: "7.0.0")
    ],
    targets: [
        .target(
            name: "TMCloudPlugin",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm")
            ],
            path: "ios/Sources/TMCloudPlugin")
    ]
)
