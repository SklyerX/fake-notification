import { Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { Box, Button, Input, Select, useToast } from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface PresetHandler {
  Name: string;
  Image: string;
  Service: string;
  IndexOf: number;
}

export default function Edit({ route, navigation }: any) {
  const { preset } = route.params;
  const finalPreset: PresetHandler = preset;

  const [image, setImage] = React.useState<string>("");
  const [name, setName] = React.useState<string>("");
  const [service, setService] = React.useState<string>("");
  const [success, setSuccess] = React.useState<boolean>(false);
  const [asyncStorageList, setAsyncStorageList]: any = React.useState([]);

  const toast = useToast();
  const toastIdRef = React.useRef();

  useEffect(() => {
    if (image.length !== 0 && name.length !== 0 && service.length !== 0) {
      setSuccess(true);
    }
  }, [image, name, service]);

  useEffect(() => {
    const getItems = async () => {
      let items: any = await AsyncStorage.getItem("@presets")!;
      const parsed = JSON.parse(items);

      setAsyncStorageList(parsed);

      console.log(parsed);
    };
    getItems();
  }, []);

  const manageAdditionToLocalStorage = async () => {
    let items: any = await AsyncStorage.getItem("@presets")!;
    let parsed = JSON.parse(items);

    const obj = {
      image,
      name,
      service,
    };

    if (parsed.find((x: any) => x.name === name))
      return (toastIdRef.current = toast.show({
        title: "Preset Exists!",
        variant: "solid",
        description: "A preset with this name already exists!",
        backgroundColor: "#f00",
      }));

    asyncStorageList[finalPreset.IndexOf] = obj;

    console.log(parsed, asyncStorageList);

    await AsyncStorage.setItem("@presets", JSON.stringify(asyncStorageList));
    toastIdRef.current = toast.show({
      title: "Preset Created!",
      variant: "solid",
      description: "Success a new preset has been created!",
      backgroundColor: "#07D307",
    });

    console.log(await AsyncStorage.getItem("@presets"));
    // navigation.navigate("Home");
  };

  return (
    <View style={[styles.container, styles.margin]}>
      <Box alignItems="center">
        <Image
          source={{ uri: image.length > 0 ? image : finalPreset.Image }}
          style={[styles.image, { borderRadius: 100 }]}
        />
        <View>
          <Text style={{ color: "#fff", marginTop: 30, marginBottom: 5 }}>
            Preset Image
          </Text>
          <Input
            onChangeText={setImage}
            placeholder={finalPreset.Image}
            w="80"
            style={{ backgroundColor: "#1B2531", color: "#fff" }}
          />
        </View>
        <View>
          <Text style={{ color: "#fff", marginTop: 30, marginBottom: 5 }}>
            Preset name
          </Text>
          <Input
            onChangeText={setName}
            placeholder={finalPreset.Name}
            w="80"
            style={{ backgroundColor: "#1B2531", color: "#fff" }}
          />
        </View>
        <View>
          <Text style={{ color: "#fff", marginTop: 30, marginBottom: 5 }}>
            State
          </Text>
          <Select
            selectedValue={service}
            w="80"
            accessibilityLabel="Choose Service"
            placeholder={
              finalPreset.Service === "gp" ? "General Preset" : "Primary Preset"
            }
            color="#fff"
            bgColor="#1B2531"
            _selectedItem={{
              backgroundColor: "#07816a",
              color: "#1B2531",
              borderRadius: 5,
            }}
            backgroundColor="#f00"
            onValueChange={(itemValue) => setService(itemValue)}
            style={{ backgroundColor: "#1B2531" }}
          >
            <Select.Item label="Primary Preset" value="pp" />
            <Select.Item label="General Preset" value="gp" />
          </Select>
        </View>
        <Button
          disabled={!success}
          style={{
            backgroundColor: success ? "#293343" : "#1d2430",
            marginTop: 20,
          }}
          w="80"
          onPress={manageAdditionToLocalStorage}
        >
          <Text
            style={{
              fontWeight: "bold",
              color: success ? "#fff" : "#999",
            }}
          >
            Submit
          </Text>
        </Button>
      </Box>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121921",
  },
  margin: {
    paddingTop: 20,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 5,
  },
});
