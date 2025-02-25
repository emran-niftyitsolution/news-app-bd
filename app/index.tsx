import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import WebViewScreen from "../components/WebView";
import { appData } from "../data/app.data";

export default function Index() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState(appData);

  return (
    <SafeAreaView className="flex-1 bg-gray-100 relative">
      {!url && (
        <ScrollView>
          <View className="flex-row flex-wrap p-5 gap-4 justify-between">
            {data.map((item) => (
              <Pressable
                key={item.id}
                className="bg-white rounded-xl p-2 shadow-sm w-[48%]"
                onPress={() => setUrl(item.url)}
              >
                {item.image ? (
                  <View className="w-full h-20">
                    <Image
                      source={{ uri: item.image }}
                      className="w-full h-full rounded-lg"
                      resizeMode="contain"
                    />
                  </View>
                ) : (
                  <Text className="text-gray-800 font-bold">{item.name}</Text>
                )}
              </Pressable>
            ))}
          </View>
        </ScrollView>
      )}

      {url && (
        <View className="flex-1 bg-white">
          <View className="flex-row justify-between items-center p-2">
            <View />
            <Pressable
              className="bg-sky-600 p-2 rounded-lg w-[100px] flex-row items-center gap-2"
              onPress={() => setUrl("")}
            >
              <Ionicons name="chevron-back" size={24} color="white" />
              <Text className="text-white font-bold text-xl text-center">
                BACK
              </Text>
            </Pressable>
          </View>
          <WebViewScreen url={url} />
        </View>
      )}
    </SafeAreaView>
  );
}
