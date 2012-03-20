package ca.cultureplex.drglearning;

import android.webkit.WebView;

import com.phonegap.DroidGap;

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