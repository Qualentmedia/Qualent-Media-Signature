# Keep JavaScript interfaces (none defined yet, but future-proof).
-keepattributes JavascriptInterface
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# WebView + Chrome client callbacks.
-keep class android.webkit.** { *; }

# Firebase Cloud Messaging service.
-keep class com.jkjobalerts.app.JkMessagingService { *; }

# Keep annotated Kotlin metadata for reflection-free operation.
-keepattributes *Annotation*
