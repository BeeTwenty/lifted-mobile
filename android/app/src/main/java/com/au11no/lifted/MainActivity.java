package com.au11no.lifted;

import android.content.Intent;
import android.os.Bundle;
import android.provider.Settings;
import android.net.Uri;
import android.os.PowerManager;
import android.content.Context;
import android.util.Log;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        checkBatteryOptimization();
    }

    private void checkBatteryOptimization() {
        PowerManager pm = (PowerManager) getSystemService(Context.POWER_SERVICE);

        if (pm != null && !pm.isIgnoringBatteryOptimizations(getPackageName())) {
            Log.d("BatteryOptimization", "Requesting battery optimization exemption");

            Intent intent = new Intent(Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS);
            intent.setData(Uri.parse("package:" + getPackageName()));

            try {
                startActivity(intent);
            } catch (Exception e) {
                Log.e("BatteryOptimization", "Battery optimization request failed", e);
            }
        } else {
            Log.d("BatteryOptimization", "Battery optimization already ignored.");
        }
    }
}
