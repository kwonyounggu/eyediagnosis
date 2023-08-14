import React, { useState} from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import _ from "lodash";

import chatGptQueryTable from '../database/sqlite/chatGptQuery';
import { SQL_QUERY_LIMIT } from '../constants';

import {AppContext} from '../contexts/appProvider';
import { displayDetailedQueryDataName } from '../constants';

//The following is commented in due to the cycling import, so use common constant file to share
//import {displayDetailedQueryDataName} from './diagnosisScreen';



export default function ListDataScreen({navigation, route}) 
{
  const {chatGptUser} = React.useContext(AppContext).state;
  const [ columns, setColumns ] = useState(["Age","Sex","MedHist","Symptoms","Signs"]);
  const [ direction, setDirection ] = useState(null);
  const [ selectedColumn, setSelectedColumn ] = useState(null);
  const [ chatGptData, setChatGptData ] = useState([]);

  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  
  //const [maxRecords, setMaxRecords] = useState(-1);
  
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const [noMoreData, setNoMoreData] = useState(false);
  
  React.useEffect
  (
		() => 
	    {
			console.log("INFO: deleteId = ", route.params?.deleteId)
			setChatGptData(chatGptData.filter((item)=>item.id !== route.params?.deleteId));
			setSelectedIndex(-1);
			//setMaxRecords(maxRecords -1);
			
	  	}, [route.params?.deleteId]
  );
  React.useEffect
  (
		() => 
	    {
			if (loading && !noMoreData)
			chatGptQueryTable.getLimitedByUserId(chatGptUser.id, SQL_QUERY_LIMIT, offset)
						     .then
						     (
								 (resultSet) => 
							     {
									 if (resultSet.length > 0)
									 {
										 offset ? setChatGptData([...chatGptData, ...resultSet]) : setChatGptData(resultSet);
										 //if (offset) setChatGptData([...chatGptData, ...resultSet])
										 //else setChatGptData(resultSet);
										 setOffset(offset + 1);
									 }
									 
									 if (resultSet.length < SQL_QUERY_LIMIT) setNoMoreData(true);
								 }
							 )
						     .catch((e) => console.error(e))
						     .finally(() => setLoading(false));
			
	  	}, [loading]
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
  const getMoreData = () =>
  {
	  console.log("get More data with offset: " + offset, "  currently retrieved len: ", chatGptData.length);
	  /*if (chatGptData.length < maxRecords && !loading) 
	  {
		  console.log("more data with offset: " + offset, " maxRecords: ", maxRecords, " currently retrieved len: ", chatGptData.length); 
		  setLoading(true); 
		  setOffset(offset + 1);
	  }*/
	  
	  if (!noMoreData && !loading)
	  {
		  setLoading(true); 
		  //setOffset(offset + 1);
	  }
  }
  const onSelectRow = (item, index) =>
  {
	  setSelectedIndex(index);
	  //console.log('selected item: ', item);
	  navigation.navigate(displayDetailedQueryDataName, item);
  }
  const renderFooter = () =>
  (
	<View>
		{ noMoreData ? <Text style={{textAlign: 'center'}}>No (More) Data</Text> :
											 loading && <ActivityIndicator size='large' />
		}
	</View>  
  );
  return (
    <View style={styles.container}>
      <FlatList 
        data={chatGptData}
        extraData={selectedIndex}
        style={{width:"95%"}}
        keyExtractor={(item, index) => index + ""}
        ListHeaderComponent={tableHeader}
        ListFooterComponent={renderFooter}
        stickyHeaderIndices={[0]}
        onEndReachedThreshold={0}
        onEndReached={getMoreData}
        renderItem=
        {
			({item, index})=> 
	        { //console.log("index: ", index);
	          return (
			  <TouchableWithoutFeedback onPress={()=>onSelectRow(item, index)}>
	            <View style={{...styles.tableRow, backgroundColor: (index===selectedIndex ? '#1B98E099': (index % 2 == 1 ? "#F0FBFC" : "white"))}}>
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

    </View>
  );
}
//#37C2D0
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
	    backgroundColor: "#f2f1ef",
	    borderTopEndRadius: 0,
	    borderTopStartRadius: 0,
	    height: 45
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
	    color: "black",
	    fontWeight: "bold"
	  },
	  columnRowTxt: 
	  {
	    textAlign:"center"
	  }
	}
);

