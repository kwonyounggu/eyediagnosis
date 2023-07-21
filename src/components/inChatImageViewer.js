import * as React from 'react';
import { View, Text, Image, Animated, Dimensions } from 'react-native';
import { PanGestureHandler, PinchGestureHandler, State } from 'react-native-gesture-handler';



export default function ChatImageViewer ({route, navigation})
{
	const {image, fileName} = route.params;
	const [panEnabled, setPanEnabled] = React.useState(false);
	
	const scale = React.useRef(new Animated.Value(1)).current;
  	const translateX = React.useRef(new Animated.Value(0)).current;
  	const translateY = React.useRef(new Animated.Value(0)).current;

  	const pinchRef = React.createRef();
  	const panRef = React.createRef();
  	
  	const onPinchEvent = Animated.event
  	(
		  [
			  {
    			nativeEvent: { scale }
  			  }
  		  ],
    	  { useNativeDriver: true }
    );
    
    const onPanEvent = Animated.event
    (
		[
			{
    			nativeEvent: 
    			{
			      translationX: translateX,
			      translationY: translateY
			    }
  			}
  		],
    	{ useNativeDriver: true }
    );
  
    const handlePinchStateChange = ({ nativeEvent }) => 
    {
	    // enabled pan only after pinch-zoom
	    if (nativeEvent.state === State.ACTIVE) {setPanEnabled(true);}
	
	    // when scale < 1, reset scale back to original (1)
	    const nScale = nativeEvent.scale;
	    if (nativeEvent.state === State.END) 
	    {
	      if (nScale < 1) 
	      {
	        Animated.spring
	        (
				scale, 
				{
		          toValue: 1,
		          useNativeDriver: true
		        }
		    ).start();
	        Animated.spring
	        (
				translateX, 
				{
		          toValue: 0,
		          useNativeDriver: true
		        }
		    ).start();
	        Animated.spring
	        (
				translateY, 
				{
		          toValue: 0,
		          useNativeDriver: true
		        }
		    ).start();
	
	        setPanEnabled(false);
	      }
	    }
	};
	React.useEffect
	(
		() =>
		{
			navigation.setOptions
	        (
				{
					headerTitle: () => <Text numberOfLines={1} ellipsizeMode={'tail'}>&nbsp;{fileName}</Text>,
					headerLeft: () => <Text onPress={()=>navigation.goBack()}>&#x2190;&nbsp;IMAGE:</Text>
		        }
		    )
		 },[]
	)
	
	return (
		<View>
	      <PanGestureHandler
	        onGestureEvent={onPanEvent}
	        ref={panRef}
	        simultaneousHandlers={[pinchRef]}
	        enabled={panEnabled}
	        failOffsetX={[-1000, 1000]}
	        shouldCancelWhenOutside
	      >
	        <Animated.View>
	          <PinchGestureHandler
	            ref={pinchRef}
	            onGestureEvent={onPinchEvent}
	            simultaneousHandlers={[panRef]}
	            onHandlerStateChange={handlePinchStateChange}
	          >
	            <Animated.Image
	              source={{ uri: image }}
	              style={{
	                width: '100%',
	                height: '100%',
	                transform: [{ scale }, { translateX }, { translateY }]
	              }}
	              resizeMode="contain"
	            />
	
	          </PinchGestureHandler>
	        </Animated.View>
	
	      </PanGestureHandler>
	    </View>	
	);
	//return (<View style={{flex: 1}}><Image source={{uri: image}}/></View>);
}