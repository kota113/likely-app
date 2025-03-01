export ANDROID_HOME="/usr/lib/android-sdk"
export EAS_LOCAL_BUILD_ARTIFACTS_DIR=./builds
eas build -p android --profile development --local
# rename the latest modified file to dev.apk
find "$EAS_LOCAL_BUILD_ARTIFACTS_DIR" -name "*.apk" -sort -limit 1 -exec mv {} dev.apk \;
