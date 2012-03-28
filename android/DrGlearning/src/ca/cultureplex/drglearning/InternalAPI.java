package ca.cultureplex.drglearning;

import com.phonegap.DroidGap;

import android.webkit.WebView;


public class InternalAPI {
    private WebView mAppView;
    private DroidGap mGap;

    public InternalAPI(DroidGap gap, WebView view)
    {
        mAppView = view;
        mGap = gap;
    }

    public String getTest(){
        return "Test!";
    }
}