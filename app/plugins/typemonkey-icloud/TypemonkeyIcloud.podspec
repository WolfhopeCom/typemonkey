Pod::Spec.new do |s|
  s.name = 'TypemonkeyIcloud'
  s.version = '1.0.0'
  s.summary = 'Keeps TypeMonkey progress in the iCloud key-value store.'
  s.license = { :type => 'Proprietary', :text => 'Part of TypeMonkey by Wolfhope.' }
  s.homepage = 'https://wolfhopecom.github.io/typemonkey/'
  s.author = 'Wolfhope'
  s.source = { :git => 'https://github.com/WolfhopeCom/typemonkey.git', :tag => s.version.to_s }
  s.source_files = 'ios/Sources/**/*.{swift,h,m}'
  s.ios.deployment_target = '15.0'
  s.dependency 'Capacitor'
  s.swift_version = '5.1'
end
