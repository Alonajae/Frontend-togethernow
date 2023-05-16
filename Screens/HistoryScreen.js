import { View, Text } from 'react-native'
import React from 'react'

export default function HistoryScreen() {

const [trajets, setTrajets] = useState([]);

useEffect(() => {
 fetch(`https:// lien vers l'API /trajets`)
.then(response => response.json())
.then(data => setTrajets(data))
.catch(error => console.log(error));
    }, []);
    
  return (
    <View>
      <Text>Historic</Text>
    </View>
  )
}

