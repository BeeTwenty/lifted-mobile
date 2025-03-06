
package com.au11no.lifted;

import com.getcapacitor.BridgeActivity;
import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebSettings;
import android.content.Intent;
import android.os.PowerManager;
import android.net.Uri;
import android.provider.Settings;
import android.os.Build;
import android.app.NotificationManager;
import android.app.NotificationChannel;
import android.content.Context;
import android.graphics.Color;
import android.util.Log;
import androidx.core.app.NotificationManagerCompat;
import androidx.core.content.ContextCompat;

public class MainActivity extends BridgeActivity {
    private static final String TAG = "LiftedApp";
    private static final String CHANNEL_ID = "workout_timer";
    private static final String CHANNEL_NAME = "Workout Timer";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        registerPlugins();
        super.onCreate(savedInstanceState);
        Log.d(TAG, "MainActivity onCreate");

        WebView webView = new WebView(this);
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setMediaPlaybackRequiresUserGesture(false);
        
        setupNotificationChannels();
        requestBatteryOptimizationExemption();
    }
    
    @Override
    public void onResume() {
        super.onResume();
        Log.d(TAG, "MainActivity onResume");
        
        // Check notification permission status on resume
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            boolean areNotificationsEnabled = NotificationManagerCompat.from(this).areNotificationsEnabled();
            Log.d(TAG, "Notifications enabled: " + areNotificationsEnabled);
        }
    }
    
    private void setupNotificationChannels() {
        // Create notification channels for Android O and above
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationManager notificationManager = 
                (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
            
            // Delete any existing channels to ensure we're using the latest settings
            try {
                notificationManager.deleteNotificationChannel(CHANNEL_ID);
                Log.d(TAG, "Deleted existing notification channel");
            } catch (Exception e) {
                Log.d(TAG, "No existing channel to delete");
            }
            
            // Create the main notification channel
            NotificationChannel channel = new NotificationChannel(
                CHANNEL_ID,
                CHANNEL_NAME,
                NotificationManager.IMPORTANCE_HIGH
            );
            channel.setDescription("Notifications for workout timers and completions");
            channel.enableVibration(true);
            channel.enableLights(true);
            channel.setLightColor(Color.RED);
            channel.setLockscreenVisibility(android.app.Notification.VISIBILITY_PUBLIC);
            channel.setShowBadge(true);
            channel.setBypassDnd(true);
            
            notificationManager.createNotificationChannel(channel);
            Log.d(TAG, "Created notification channel: " + CHANNEL_ID);
            
            // List all channels for debugging
            for (NotificationChannel ch : notificationManager.getNotificationChannels()) {
                Log.d(TAG, "Available channel: " + ch.getId() + " - " + ch.getName());
            }
        }
    }
    
    private void requestBatteryOptimizationExemption() {
        // Request battery optimization exemption for background processes
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            String packageName = this.getPackageName();
            PowerManager pm = (PowerManager) this.getSystemService(POWER_SERVICE);
            if (!pm.isIgnoringBatteryOptimizations(packageName)) {
                try {
                    Intent intent = new Intent();
                    intent.setAction(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS);
                    intent.setData(Uri.parse("package:" + packageName));
                    this.startActivity(intent);
                    Log.d(TAG, "Requested battery optimization exemption");
                } catch (Exception e) {
                    Log.e(TAG, "Failed to request battery optimization exemption", e);
                }
            }
        }
    }
}
