import {Tabs} from 'expo-router';

export default function TabsLayout(){
    return <Tabs screenOptions={{ headerShown: false, tabBarShowLabel: false }}>
        <Tabs.Screen name="index" options={{title: 'Home'}}/>
        <Tabs.Screen name="chat" options={{title: 'Chat'}}/>
        <Tabs.Screen name="post" options={{title: 'Post'}}/>
    </Tabs>
}