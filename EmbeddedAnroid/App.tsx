/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import firestore from '@react-native-firebase/firestore';

import { Dimensions } from "react-native";
const screenWidth = Dimensions.get("window").width;

interface IMoistureOjbect {
  created_at: string;
  value: number;
}

const chartConfig = {
  backgroundGradientFrom: "#1E2923",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#08130D",
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false // optional
};

function App(): JSX.Element {
  const [state, setState] = useState<number>();
  const [moistureV1state, setMoistureV1State] = useState<number>();
  const [moistureV2state, setMoistureV2State] = useState<number>();
  const [moistureV1, setMoistureV1] = useState<IMoistureOjbect[]>([]);
  const [moistureV2, setMoistureV2] = useState<IMoistureOjbect[]>([]);
  const [V1data, setV1Data] = useState<number[]>([]);
  const [V2data, setV2Data] = useState<number[]>([]);
  const [createData, setCreateData] = useState<string[]>([]);


  useEffect(() => {
    const firebaseConnection = () => {

      // firestore().collection('env').onSnapshot(data => {
      //   const dataSensor: any = [];
      //   data.forEach((item) => {
      //     dataSensor.push(item.data());
      //   });
      //   dataSensor.sort((a: any, b: any) => a.created_at - b.created_at);
      //   setDataSensor(dataSensor);
      //   const tempValues: Array<Number> = [];
      //   const created_at_data: any = [];
      //   dataSensor.forEach((data: any) => {
      //     tempValues.push(data.value.state.desired.temperature);

      //     const createdAt = new Date(data.created_at);
      //     const options: any = {
      //       // year: 'numeric',
      //       month: 'numeric',
      //       day: 'numeric',
      //       hour: 'numeric',
      //       minute: 'numeric',
      //       second: 'numeric',
      //     };
      //     const vietnameseDateFormat = createdAt.toLocaleDateString('vi-VN', options);

      //     console.log(vietnameseDateFormat);

      //     created_at_data.push(vietnameseDateFormat);
      //   });

      //   setTemperature(tempValues);
      //   setCreatedAtData(created_at_data);
      // });

      firestore().collection('state').onSnapshot(data => {
        data.forEach(item => {
          setState(item.data().value);
        });
      });

      firestore().collection('moistureV1state').onSnapshot(data => {
        data.forEach(item => {
          setMoistureV1State(item.data().value);
        });
      });

      firestore().collection('moistureV2state').onSnapshot(data => {
        data.forEach(item => {
          setMoistureV2State(item.data().value);
        });
      });

      firestore().collection('moisturev1').onSnapshot(data => {
        const moisturedata: IMoistureOjbect[] = [];
        const tempData: number[] = [];
        data.forEach(item => {
          const objectData: IMoistureOjbect = {
            created_at: item.data().created_at,
            value: Number(item.data().value),
          }
          tempData.push(objectData.value);
          moisturedata.push(objectData);
          console.log("moisture v1 array: ", moisturedata);
        });
        setMoistureV1(moisturedata);
        setV1Data(tempData);
      });

      firestore().collection('moisturev2').onSnapshot(data => {
        const moisturedata: IMoistureOjbect[] = [];
        const tempData: number[] = [];
        const tempCreated_At: string[] = [];
        data.forEach(item => {
          // setMoistureV2(item.data().value);
          const objectData: IMoistureOjbect = {
            created_at: item.data().created_at,
            value: Number(item.data().value),
          }
          tempData.push(objectData.value);
          tempCreated_At.push(objectData.created_at);
          moisturedata.push(objectData);
          console.log("moisture v2 array: ", moisturedata);

        });
        setV2Data(tempData);
        setMoistureV2(moisturedata);
        setCreateData(tempCreated_At);

      });
    }

    firebaseConnection();

  }, []);

  console.log(state, "moisture v1 state:", moistureV1, "moisture V2 state: ", moistureV2);
  const renderUI = (data: IMoistureOjbect[]) => {
    return data.map((element: IMoistureOjbect) => {
      return <Text>{element.created_at + " " + element.value}</Text>
    })
  };

  const data = {
    labels: createData,
    datasets: [
      {
        data: V2data,
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
        strokeWidth: 2 // optional
      }
    ],
    legend: ["Rainy Days"] // optional
  };

  return (
    <SafeAreaView>
      {/* <Text>{renderUI(moistureV2)}</Text> */}
      <LineChart
        data={data}
        width={screenWidth}
        height={220}
        chartConfig={chartConfig}
      />
    </SafeAreaView>
  );
}



export default App;
