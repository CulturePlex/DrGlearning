package ca.cultureplex.drglearning;

import org.apache.cordova.DroidGap;

import android.webkit.WebView;


public class InternalAPI {
    private WebView mAppView;
    private DroidGap mGap;

    public InternalAPI(DroidGap gap, WebView view) {
        mAppView = view;
        mGap = gap;
    }

    public String getTest() {
        return "Test!";
    }
}