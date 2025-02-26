import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  FlatList,
  Image,
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
  const [data, setData] = useState(appData);

  const renderItem = ({ item }: { item: any }) => (
    <Pressable
      key={item.id}
      className="bg-white rounded-xl p-2 shadow-sm w-[46%] mr-9"
      onPress={() => setUrl(item.url)}
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
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100 relative">
      {!url && (
        <View>
          <View className="px-5 mb-5">
            <TextInput
              placeholder="Search in english"
              className="bg-white rounded-xl p-5 shadow-sm w-full"
              onChangeText={(value) => {
                setData(
                  appData.filter((item) =>
                    item.name.toLowerCase().includes(value.toLowerCase())
                  )
                );
              }}
            />
          </View>
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            contentContainerStyle={{
              paddingLeft: 20,
              paddingRight: 20,
              gap: 16,
            }}
          />
        </View>
      )}

      {url && (
        <View className="flex-1 bg-white">
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
  );
}
