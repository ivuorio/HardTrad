import React, {Component} from 'react';
import {
    Image,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    TouchableOpacity,
    View,
    ScrollView,
    Dimensions
}from 'react-native';
import Constants from 'expo-constants';
import * as ImagePicker from 'expo-image-picker';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
const Stack = createStackNavigator();

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;


export default function App(){
    const [selectedImage, setSelectedImage] = React.useState(null);
    const [listView, setListView] = React.useState(null);
    const [tagList, setTagList] = React.useState({tags:[]});
    const [gearState, setGearState] = React.useState({gear:gearList})

    //Open phones native image chooser
    let openImagePickerAsync = async ({navigation}) => {
	let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

	if (permissionResult.granted === false) {
	    alert('Permission to access camera roll is required!');
	    return;
	}

	let pickerResult = await ImagePicker.launchImageLibraryAsync();
	console.log(pickerResult);

	if (pickerResult.cancelled === true) {
	    navigation.goBack()
	    return;
	}

	setSelectedImage({ localUri: pickerResult.uri });
	//setListView(null);
    };
    //close image view mode
    let closeImageView = async () => {
	setSelectedImage(null);
    }
    //Set state for opening gear chooser
    let searchGear = async (evt) => {
	setListView({y:(evt.nativeEvent.locationY*100)/screenHeight, x:(evt.nativeEvent.locationX*100)/screenWidth, search:true});
	console.log(listView)
	//console.log(gearList)
    }
    //handle press on image
    function handlePress(evt){
	//pick location of the touch
	const top = (evt.nativeEvent.locationY*100)/screenHeigth;
	const left = (evt.nativeEvent.locationX*100)/screenwidth;
	setListView({x:left, y:top, search:true})
	console.log(top);
	console.log(left);
    }
    //function for choosing 
    function tagGear(gear){
	let newView = {
	    locationX:listView.x,
	    locationY:listView.y,
	    name:gear.name,
	    id:gear.id,
	}
	console.log("Adding new tag")
	let tagsList = []
	if (tagList !== null){
	    tagsList = tagList.tags
	}
	tagsList.push(newView)
	setTagList({tags:tagsList})
	var gears = removeFromList(gearState.gear,gear)
	setGearState({gear:gears})
	console.log(tagList)
	setListView(null)
    }
    //dynamic styling function
    function dynamicStyle(data){
	let left = (screenWidth * data.locationX)/100;
	let top =  (screenHeight * data.locationY)/100;
	
	return {
	    position:'absolute',
	    top:top,
	    left:left,
	    justifyContent:'center'
	}
    }
    function removeFromList(list, item){
	var index = list.indexOf(item)
	if (index !== -1) {
	    list.splice(index, 1);
	}
	return list
    }
    function removeTag(tag){
	console.log("removing tag")
	console.log(tag)
	tagsList = tagList.tags
	console.log(tagsList)
	var index = tagsList.indexOf(tag)
	if (index !== -1) {
	    tagsList.splice(index, 1);
	}
	console.log(index)
	setTagList({tags:tagsList})
    }

    function frontPageView({navigation}){
	return(
	    <View style={styles.container}>
		<Image source={{ uri: 'https://static.vecteezy.com/system/resources/previews/001/206/203/non_2x/mountain-logo-png.png' }} style={styles.logo} />
		    <Text style={styles.instructions}>
			Start by choosing a photo!
		    </Text>

		<TouchableOpacity onPress={() => { openImagePickerAsync(navigation); navigation.navigate('Route')}} style={styles.button}>
	
		    <Text style={styles.buttonText}>Pick a photo</Text>
		</TouchableOpacity>
	    </View>
	);
    }

    function gearListView({navigation}) {
	return(
	    <View style={styles.container}>
	    <Text> Choose gear</Text>
	    {
		<View style={{zIndex:99}}>
		<ScrollView>
		{
		    gearState.gear.map(gear=>(
			<TouchableOpacity style={styles.buttonSmall} key={gear.id} onPress={() => {tagGear(gear); navigation.goBack();}}>
			    <View>
				<Text style={styles.smallButtonText}> {gear.name}</Text>
			    </View>
			</TouchableOpacity>
		    ))
		}
		<TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
		    <Text style={styles.buttonText}> Cancel </Text>
		</TouchableOpacity>
		</ScrollView>
		</View>
	    }
	    </View>
	)
    }
    function imageTagsView({navigation}){
	
	return(
	    <View style={styles.container}>
		<TouchableWithoutFeedback onPress={(event) => {searchGear(event); navigation.navigate('Gear List')}}>
		    <View>
			<Image
			source={{ uri:selectedImage.localUri}}
			style={styles.thumbnail}
		    />
		    {
			tagList.tags.map(list=>(
			    <View key={list.id} style={dynamicStyle(list)}>
				<View style={styles.tagTriange}>
				</View>
				<View style={styles.tag}>
				    <TouchableOpacity
					key={list.id}
					onPress={() => removeTag(list)}
				    >
					<Text>{list.name}</Text>
				    </TouchableOpacity>
				</View>
			    </View>
			))
		    }
		    </View>
		    </TouchableWithoutFeedback>
		<Text style={styles.instructions}>
		    This is your photo
		</Text>
		<TouchableOpacity onPress={() => {closeImageView; navigation.navigate('HardTrad');}} style={styles.button}>
		    <Text style={styles.buttonText}>Close</Text>
		</TouchableOpacity>
	    </View>
	);
	
    }
    return(
	<NavigationContainer>
	    <Stack.Navigator mode="modal">
		<Stack.Screen name="HardTrad" component={frontPageView} />
		<Stack.Screen name="Gear List" component={gearListView} />
		<Stack.Screen name="Route" component={imageTagsView} />
	    </Stack.Navigator>
	</NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {	
	flex: 1,
	backgroundColor: '#fff',
	alignItems: 'center',
	justifyContent: 'center',
	marginTop: Constants.statusBarHeight,
    },
    logo: {
	width: 320,
	height: 300,
	marginBottom: 20,
    },
    instructions: {
	color: '#888',
	fontSize: 18,
	marginHorizontal: 15,
	marginBottom: 3,
    },
    button: {
	backgroundColor: 'gray',
	padding: 20,
	borderRadius: 5,
	marginBottom:5 
    },
    tag: {
	backgroundColor: 'gray',
	padding: 3,
	borderRadius: 5,
	opacity:0.75,
    },
    tagTriangle:{
	height:0,
	width:0,
	left:15,
	borderLeftColor:'transparent',
	borderLeftWidth:7,
	borderRightColor:'transparent',
	borderRightWidth:7,
	borderBottomColor:'rgba(0,0,0,.30)',
	borderBottomWidth:7

    },
    removeTag:{
	backgroundColor:'white',
	height:15,
	width:15,
	marginLeft:5,
	borderRadius:15
    },
    buttonSmall: {
	backgroundColor: 'gray',
	padding: 15,
	borderRadius: 7,
	marginBottom:5 
    },
    smallButtonText: {
	fontSize: 15,
	color: '#fff',
    },
    buttonText: {
	fontSize: 20,
	color: '#fff',
    },
    thumbnail: {
	width: screenWidth,
	height: screenHeight-100,
	resizeMode: "contain"
    },
    });

const gearList=[
	    {
		id:1,
		name:'C4 #0.3'
	    },
	    {
		id:2,
		name:'C4 #0.4'
	    },
	    {
		id:3,
		name:'C4 #0.5'
	    },
	    {
		id:4,
		name:'C4 #0.75'
	    },
	    {
		id:5,
		name:'C4 #1'
	    },
	    {
		id:6,
		name:'C4 #2'
	    },
	    {
		id:7,
		name:'C4 #3'
	    },
	    {
		id:8,
		name:'C4 #4'
	    },
	    {
		id:9,
		name:'C4 #5'
	    },
	    {
		id:10,
		name:'C4 #6'
	    },
	    {
		id:11,
		name:'Alien 1/2'
	    },
	    {
		id:12,
		name:'Alien #3/8'
	    },
	]
