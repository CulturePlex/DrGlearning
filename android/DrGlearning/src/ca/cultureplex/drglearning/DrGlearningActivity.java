package ca.cultureplex.drglearning;

//import android.content.pm.ActivityInfo;
////import android.app.Activity;
//import android.os.Bundle;
//
//import org.apache.cordova.*;
//
//public class DrGlearningActivity extends DroidGap
//{
//    private InternalAPI api; 
//    
//	@Override
//    public void onCreate(Bundle savedInstanceState)
//    {
//        super.onCreate(savedInstanceState);
//        //super.loadUrl("file:///android_asset/www/index.html");
//        api = new InternalAPI(this, appView);
//        //super.setIntegerProperty("splashscreen", R.drawable.splash);
//        appView.addJavascriptInterface(api, "InternalApi");
//        super.setIntegerProperty("loadUrlTimeoutValue", 60000);
//        super.loadUrl("file:///android_asset/www/index.html");
//        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
//    }
//}
import android.app.Activity;
import android.os.Bundle;
import org.apache.cordova.*;

public class DrGlearningActivity extends DroidGap
{
    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        super.loadUrl("file:///android_asset/www/index.html");
    }
}