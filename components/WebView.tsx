import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, BackHandler, View } from "react-native";
import WebView, { WebViewMessageEvent } from "react-native-webview";

type Props = {
  url: string;
};

const WebViewScreen = ({ url }: Props) => {
  const [loading, setLoading] = useState(true); // State to track loading status
  const [canGoBack, setCanGoBack] = useState(false); // Track if WebView can go back

  // JavaScript to inject for blocking ads
  const removeAdsScript = `
 (function() {
  // Hide common ad-related elements using CSS
  var adSelectors = [
    'iframe', 
    '.ad', 
    '.ads', 
    '.ad-banner', 
    '[id^="ads"]', 
    '[class^="ads"]', 
    '.google-ads', 
    '#google_ads', 
    '.adsbygoogle', 
    '.ad-container', 
    '[id*="ad-"]', 
    '.sponsored', 
    '.promo', 
    '.banner-ad', 
    '.ad-box', 
    '.sticky-ad', 
    '.popup-ad',
    '.ad-unit',
    '.advertisement'
  ];

  adSelectors.forEach(function(selector) {
    var elements = document.querySelectorAll(selector);
    elements.forEach(function(el) {
      el.style.display = 'none';
    });
  });

  // Block known ad-related network requests (including Google and other ad servers)
  var blockAdRequests = function(url) {
    var adDomains = [
      'googleadservices', 'doubleclick', 'ads', 'advertising', 'adservice', 'adserver',
      'adclick', 'teads.tv', 'amazon-adsystem', 'adroll', 'outbrain', 'taboola', 'serving-sys',
      'openx', 'rubiconproject', 'adnxs', 'ads.yahoo.com', 'adtech', 'adform', 'adsafe', 'contextweb'
    ];
    return adDomains.some(function(domain) {
      return url.includes(domain);
    });
  };

  // Block XMLHttpRequest to known ad servers
  var originalOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url) {
    if (blockAdRequests(url)) {
      console.log('Blocked XMLHttpRequest to ad server:', url);
      return;
    }
    originalOpen.apply(this, arguments);
  };

  // Block fetch requests for ad servers
  var originalFetch = window.fetch;
  window.fetch = function(resource, options) {
    if (blockAdRequests(resource)) {
      console.log('Blocked fetch request to ad server:', resource);
      return Promise.resolve(new Response('', { status: 204 })); // Empty response to block
    }
    return originalFetch.apply(this, arguments);
  };

  // Remove scripts that may be used to serve ads
  var adScriptPatterns = ['ads', 'advert', 'googleads', 'doubleclick', 'googlesyndication', 'taboola', 'teads'];
  var adScripts = document.querySelectorAll('script[src]');
  adScripts.forEach(function(script) {
    var src = script.src;
    if (adScriptPatterns.some(function(pattern) { return src.includes(pattern); })) {
      console.log('Removed ad script:', src);
      script.remove();
    }
  });

  // Remove anchor tags or links with URLs that match ad-related domains
  var adLinks = document.querySelectorAll('a[href*="googleadservices"], a[href*="doubleclick"], a[href*="ads"], a[href*="advert"], a[href*="google.com/pagead"]');
  adLinks.forEach(function(link) {
    console.log('Blocked ad link:', link.href);
    link.style.display = 'none';
  });
})();
`;

  // Callback for handling navigation requests in WebView
  const onNavigationStateChange = useCallback((navState: any) => {
    setCanGoBack(navState.canGoBack); // Update state based on whether WebView can go back
  }, []);

  // Error handling: show an alert when an error occurs while loading the WebView
  const handleError = (error: any) => {
    setLoading(false);
    Alert.alert(
      "Error",
      "There was an error loading the page. Please try again later."
    );
  };

  // Handling message events (if needed for communication with WebView content)
  const handleMessage = (event: WebViewMessageEvent) => {
    console.log("Message from WebView:", event.nativeEvent.data);
  };

  // Handle back button press
  const handleBackPress = useCallback(() => {
    if (canGoBack) {
      webViewRef.current?.goBack(); // If the WebView can go back, go back in history
      return true; // Prevent default back action
    } else {
      return false; // Let the default back action occur
    }
  }, [canGoBack]);

  const webViewRef = React.useRef<WebView>(null);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress
    );

    return () => {
      backHandler.remove(); // Clean up listener when component is unmounted
    };
  }, [handleBackPress]);

  return (
    <View className="flex-1 h-screen overflow-hidden">
      {loading && (
        <View className="h-full justify-center items-center">
          <ActivityIndicator size="large" color="#db2777" />
        </View>
      )}

      <WebView
        ref={webViewRef}
        className="flex-1"
        source={{ uri: url }}
        injectedJavaScript={removeAdsScript}
        onLoadEnd={() => setLoading(false)} // Hide loader as soon as the WebView starts rendering
        onError={handleError} // Handle error
        onNavigationStateChange={onNavigationStateChange} // Handle navigation state change
        onMessage={handleMessage} // Handle messages from WebView
        startInLoadingState={false} // Prevent default WebView loading spinner
        javaScriptEnabled={true} // Enable JavaScript
        domStorageEnabled={true} // Enable DOM storage
        mediaPlaybackRequiresUserAction={false} // Allow media playback without user interaction
        mixedContentMode="always" // Allow mixed content (HTTP inside HTTPS)
        allowsInlineMediaPlayback={true} // Allow inline video playback
        thirdPartyCookiesEnabled={true} // Enable third-party cookies if needed
      />
    </View>
  );
};

export default WebViewScreen;
