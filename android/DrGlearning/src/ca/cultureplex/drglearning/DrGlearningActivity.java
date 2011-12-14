package ca.cultureplex.drglearning;

import android.os.Bundle;

import com.phonegap.*;

public class DrGlearningActivity extends DroidGap {
	
	private InternalAPI api; 
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        super.init();
        api = new InternalAPI(this, appView);
        super.setIntegerProperty("splashscreen", R.drawable.splash);
        appView.addJavascriptInterface(api, "InternalApi");
        super.loadUrl("file:///android_asset/www/index.html");
    }
}