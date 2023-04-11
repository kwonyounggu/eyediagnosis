import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import _ from "lodash";

import chatGptUserTable from '../database/sqlite/chatGptUser';
import chatGptQueryTable from '../database/sqlite/chatGptQuery';

import {AppContext} from '../contexts/appProvider';

//The following is commented in due to the cycling import, so use common constant file to share
//import {displayDetailedQueryDataName} from './diagnosisScreen';



export default function ListDataScreen({navigation}) 
{
  const {chatGptUser} = React.useContext(AppContext).state;
  const [ columns, setColumns ] = useState(["Age","Sex","MedHist","Symptoms","Signs"]);
  const [ direction, setDirection ] = useState(null);
  const [ selectedColumn, setSelectedColumn ] = useState(null);
  const [ chatGptData, setChatGptData ] = useState([]);


   React.useEffect
   (
		() => 
	    {
			chatGptUserTable.findByEmail(chatGptUser.email)
	        			    .then
	        			    (
								(o)=>
								{
									chatGptQueryTable.getById(o.id)
												    .then((resultSet) => {console.log("LEN: ", resultSet.length);setChatGptData(resultSet);})
												    .catch((e) => console.error(e));
								}
							)
							.catch (e=>console.error(e));
			
	  	}, []
   );
  const sortTable = (column) => 
  {
    const newDirection = direction === "desc" ? "asc" : "desc" 
    const sortedData = _.orderBy(chatGptData, [column],[newDirection])
    setSelectedColumn(column)
    setDirection(newDirection)
    setChatGptData(sortedData)
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
        data={chatGptData}
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
	              <Text style={{...styles.columnRowTxt, width: '10%', fontWeight:"bold"}}>{item.age}</Text>
	              <Text style={{...styles.columnRowTxt, width: '10%'}}>{item.gender}</Text>
	              <Text style={{...styles.columnRowTxt, width: '27%'}} ellipsizeMode='tail' numberOfLines={2}>{item.medicalHistory}</Text>
	              <Text style={{...styles.columnRowTxt, width: '27%'}} ellipsizeMode='tail' numberOfLines={2}>{item.symptoms}</Text>
	              <Text style={{...styles.columnRowTxt, width: '26%'}} ellipsizeMode='tail' numberOfLines={2}>{item.signs}</Text>
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

