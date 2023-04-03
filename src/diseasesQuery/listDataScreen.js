import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import _ from "lodash";

//import {displayDetailedQueryDataName} from './diagnosisScreen';



export default function ListDataScreen({navigation}) 
{
  const [ columns, setColumns ] = useState(["Age","Sex","MedHist","Symptoms","Signs"]);
  const [ direction, setDirection ] = useState(null)
  const [ selectedColumn, setSelectedColumn ] = useState(null)
  const [ pets, setPets ] = useState([
    {
		Age: 3,
      	Gender: "M",
        MedHist: "A Dog",
        Symptoms: "Headache",
        Signs: "VA 20/30"
    },
    {
		Age: 4,
      	Gender: "F",
        MedHist: "B Dog",
        Symptoms: "Headache",
        Signs: "VA 20/30"
    },
    {
		Age: 5,
      	Gender: "M",
        MedHist: "C Dog",
        Symptoms: "Headache",
        Signs: "VA 20/30"
    },
    {
		Age: 6,
      	Gender: "M",
        MedHist: "D Dog",
        Symptoms: "Headache",
        Signs: "VA 20/30"
    },
    {
		Age: 6,
      	Gender: "M",
        MedHist: "E Dog",
        Symptoms: "Headache",
        Signs: "VA 20/30"
    },
    {
		Age: 7,
      	Gender: "M",
        MedHist: "F Dog",
        Symptoms: "Headache",
        Signs: "VA 20/30"
    },
    {
		Age: 8,
      	Gender: "M",
        MedHist: "G Dog",
        Symptoms: "Headache",
        Signs: "VA 20/30"
    },
    {
		Age: 9,
      	Gender: "M",
        MedHist: "H Dog",
        Symptoms: "Headache",
        Signs: "High Blood Pressure"
    },
    {
		Age: 10,
      	Gender: "M",
        MedHist: "I Dog",
        Symptoms: "Pain",
        Signs: "VA 20/40"
    },
    {
		Age: 11,
      	Gender: "M",
        MedHist: "J Dog",
        Symptoms: "Nausea",
        Signs: "VA 20/30"
    },
    {
		Age: 12,
      	Gender: "M",
        MedHist: "K Dog",
        Symptoms: "Headache",
        Signs: "VA 20/30"
    },
    {
		Age: 13,
      	Gender: "M",
        MedHist: "L Dog",
        Symptoms: "Fatigue",
        Signs: "VA 20/30"
    }
  ])

  const sortTable = (column) => 
  {
    const newDirection = direction === "desc" ? "asc" : "desc" 
    const sortedData = _.orderBy(pets, [column],[newDirection])
    setSelectedColumn(column)
    setDirection(newDirection)
    setPets(sortedData)
  }
  
  const stylesColumnHeader = (index) =>
  {
		switch(index)
		{
			case 0: return {...styles.columnHeader, width: '10%'};
			case 1: return {...styles.columnHeader, width: '10%'};
			case 2: return {...styles.columnHeader, width: '27%'};
			case 3: return {...styles.columnHeader, width: '27%'};
			default: return {...styles.columnHeader, width: '26%'};
		}  
  }
  
  const tableHeader = () => 
  (
    <View style={styles.tableHeader}>
    {
        columns.map((column, index) => 
        {
          {
            return (
              <TouchableOpacity 
                key={index}
                style={stylesColumnHeader(index)} 
                onPress={()=> sortTable(column)}>
                <Text style={styles.columnHeaderTxt}>
                {column + " "} 
                { selectedColumn === column && 
                	<MaterialCommunityIcons 
                      name={direction === "desc" ? "arrow-down-drop-circle" : "arrow-up-drop-circle"} 
                    />
                }
                </Text>
              </TouchableOpacity>
            )
          }
        })
    }
    </View>
  )

  const onSelectRow = (item) =>
  {
	  //console.log('selected item: ', item);
	  navigation.navigate('Detailed Data', item);
  }
  return (
    <View style={styles.container}>
      <FlatList 
        data={pets}
        style={{width:"95%"}}
        keyExtractor={(item, index) => index+""}
        ListHeaderComponent={tableHeader}
        stickyHeaderIndices={[0]}
        renderItem=
        {
			({item, index})=> 
	        {
	          return (
			  <TouchableWithoutFeedback onPress={()=>onSelectRow(item)}>
	            <View style={{...styles.tableRow, backgroundColor: index % 2 == 1 ? "#F0FBFC" : "white"}}>
	              <Text style={{...styles.columnRowTxt, width: '10%', fontWeight:"bold"}}>{item.Age}</Text>
	              <Text style={{...styles.columnRowTxt, width: '10%'}}>{item.Gender}</Text>
	              <Text style={{...styles.columnRowTxt, width: '27%'}}>{item.MedHist}</Text>
	              <Text style={{...styles.columnRowTxt, width: '27%'}}>{item.Symptoms}</Text>
	              <Text style={{...styles.columnRowTxt, width: '26%'}}>{item.Signs}</Text>
	            </View>
	          </TouchableWithoutFeedback>
	          )
	        }
	    }
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create
(
	{
	  container: 
	  {
	    flex: 1,
	    backgroundColor: '#fff',
	    alignItems: 'center',
	    justifyContent: 'center',
	    paddingTop:0
	  },
	  tableHeader: 
	  {
	    flexDirection: "row",
	    justifyContent: "space-evenly",
	    alignItems: "center",
	    backgroundColor: "#37C2D0",
	    borderTopEndRadius: 10,
	    borderTopStartRadius: 10,
	    height: 50
	  },
	  tableRow: 
	  {
	    flexDirection: "row",
	    height: 40,
	    alignItems:"center"
	  },
	  columnHeader: 
	  {
	    justifyContent: "center",
	    alignItems:"center"
	  },
	  columnHeaderTxt: 
	  {
	    color: "white",
	    fontWeight: "bold"
	  },
	  columnRowTxt: 
	  {
	    textAlign:"center"
	  }
	}
);

