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
      '.popup-ad'
    ];

    adSelectors.forEach(function(selector) {
      var elements = document.querySelectorAll(selector);
      elements.forEach(function(el) {
        el.style.display = 'none';
      });
    });
    
    // Remove scripts that may be used to serve ads
    var adScripts = document.querySelectorAll('script[src*="ads"], script[src*="advert"], script[src*="googleads"]');
    adScripts.forEach(function(script) {
      script.remove();
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
          <ActivityIndicator size="large" color="green" />
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
