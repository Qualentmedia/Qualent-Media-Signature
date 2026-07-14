package com.jkjobalerts.app

import android.app.Application
import android.app.NotificationChannel
import android.app.NotificationManager
import android.os.Build
import android.util.Log
import com.google.firebase.messaging.FirebaseMessaging

/**
 * Application entry point. Creates the notification channel used for job-alert
 * push notifications so that notifications display correctly on Android 8+, and
 * subscribes the device to the broadcast topic for new job posts.
 */
class JkApp : Application() {

    override fun onCreate() {
        super.onCreate()
        createJobAlertsNotificationChannel()
        subscribeToJobAlerts()
    }

    /**
     * Subscribe to the "new_jobs" topic. Sending a push to this topic from the
     * Firebase console (or the FCM HTTP v1 API) notifies every installed device —
     * no per-device server storage required.
     */
    private fun subscribeToJobAlerts() {
        try {
            FirebaseMessaging.getInstance().subscribeToTopic(TOPIC_NEW_JOBS)
                .addOnCompleteListener { task ->
                    if (!task.isSuccessful) {
                        Log.w(TAG, "Failed to subscribe to $TOPIC_NEW_JOBS", task.exception)
                    }
                }
        } catch (e: Exception) {
            // Firebase not yet configured (placeholder google-services.json). Safe to ignore.
            Log.w(TAG, "Firebase messaging unavailable", e)
        }
    }

    private fun createJobAlertsNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                getString(R.string.default_notification_channel_id),
                getString(R.string.notification_channel_name),
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = getString(R.string.notification_channel_description)
                enableLights(true)
                enableVibration(true)
            }
            val manager = getSystemService(NotificationManager::class.java)
            manager?.createNotificationChannel(channel)
        }
    }

    companion object {
        private const val TAG = "JkApp"
        const val TOPIC_NEW_JOBS = "new_jobs"
    }
}
