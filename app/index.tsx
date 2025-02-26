import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import WebViewScreen from "../components/WebView";
import { appData } from "../data/app.data";

export default function Index() {
  const [url, setUrl] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState(appData);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilteredData(
        appData.filter((item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handlePress = useCallback((url: string) => {
    setUrl(url);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: (typeof appData)[number] }) => (
      <Pressable
        key={item.id}
        className="bg-white rounded-xl p-2 shadow-sm w-[46%] mr-9"
        onPress={() => handlePress(item.url)}
      >
        {item.image ? (
          <View className="w-full h-20">
            <Image
              source={item.image}
              className="w-full h-full rounded-lg"
              resizeMode="contain"
            />
          </View>
        ) : (
          <Text className="text-gray-800 font-bold">{item.name}</Text>
        )}
      </Pressable>
    ),
    []
  );

  return (
    <ImageBackground
      source={require("../assets/images/background.jpg")}
      className="flex-1"
      resizeMode="cover"
    >
      <SafeAreaView className="flex-1 relative">
        {!url && (
          <>
            <View className="px-5 mb-5">
              <TextInput
                placeholder="Search in English"
                className="bg-white rounded-xl p-5 shadow-sm w-full"
                onChangeText={setSearchQuery}
              />
            </View>
            <FlatList
              data={filteredData}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              contentContainerStyle={{
                paddingLeft: 20,
                paddingRight: 20,
                gap: 16,
              }}
              initialNumToRender={10}
              maxToRenderPerBatch={20}
              windowSize={5}
            />
          </>
        )}

        {url && (
          <View className="flex-1">
            <View className="flex-row justify-between items-center p-2">
              <Pressable
                className="bg-sky-600 p-2 rounded-xl"
                onPress={() => setUrl("")}
              >
                <Ionicons name="chevron-back" size={24} color="white" />
              </Pressable>
            </View>
            <WebViewScreen url={url} />
          </View>
        )}
      </SafeAreaView>
    </ImageBackground>
  );
}
