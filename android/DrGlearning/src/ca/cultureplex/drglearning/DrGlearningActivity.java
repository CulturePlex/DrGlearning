package ca.cultureplex.drglearning;

import com.phonegap.DroidGap;

import android.content.pm.ActivityInfo;
import android.os.Bundle;

public class DrGlearningActivity extends DroidGap {
	
	private InternalAPI api; 
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        super.init();
        api = new InternalAPI(this, appView);
        //super.setIntegerProperty("splashscreen", R.drawable.splash);
        appView.addJavascriptInterface(api, "InternalApi");
        super.setIntegerProperty("loadUrlTimeoutValue", 60000);
        super.loadUrl("file:///android_asset/www/index.html");
        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
    }
}