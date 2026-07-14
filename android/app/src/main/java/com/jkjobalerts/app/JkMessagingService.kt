package com.jkjobalerts.app

import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import androidx.core.app.NotificationCompat
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage

/**
 * Receives push notifications for new job posts from Firebase Cloud Messaging.
 *
 * Supported payloads:
 *  - "notification" messages (title/body set from the Firebase console) are shown
 *    automatically by the system when the app is in the background, and here when
 *    it is in the foreground.
 *  - "data" messages let your backend attach a "url" so tapping the notification
 *    opens that specific job page inside the app. Recommended keys:
 *        title  -> notification title (falls back to the app name)
 *        body   -> notification text
 *        url    -> deep link opened on tap (e.g. https://jkjobalerts.com/some-job)
 */
class JkMessagingService : FirebaseMessagingService() {

    override fun onMessageReceived(message: RemoteMessage) {
        super.onMessageReceived(message)

        val data = message.data
        val title = message.notification?.title
            ?: data["title"]
            ?: getString(R.string.app_name)
        val body = message.notification?.body
            ?: data["body"]
            ?: getString(R.string.new_job_alert)
        val url = data["url"] ?: data["link"]

        showNotification(title, body, url)
    }

    override fun onNewToken(token: String) {
        super.onNewToken(token)
        // The device registration token. Send this to your server if you want to
        // target individual devices; for broadcast "new job" alerts, subscribe every
        // device to a topic instead (see the README) — no server storage required.
    }

    private fun showNotification(title: String, body: String, url: String?) {
        val intent = Intent(this, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
            if (!url.isNullOrBlank()) {
                putExtra(MainActivity.EXTRA_TARGET_URL, url)
            }
        }

        val flags = PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        // Unique request code so multiple alerts don't overwrite each other's intent.
        val requestCode = (System.currentTimeMillis() and 0x0FFFFFFF).toInt()
        val pendingIntent = PendingIntent.getActivity(this, requestCode, intent, flags)

        val builder = NotificationCompat.Builder(this, getString(R.string.default_notification_channel_id))
            .setSmallIcon(R.drawable.ic_stat_notify)
            .setContentTitle(title)
            .setContentText(body)
            .setStyle(NotificationCompat.BigTextStyle().bigText(body))
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setAutoCancel(true)
            .setContentIntent(pendingIntent)

        val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        manager.notify(requestCode, builder.build())
    }
}
