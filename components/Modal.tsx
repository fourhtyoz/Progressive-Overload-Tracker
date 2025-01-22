// import React, { useState } from 'react';
// import { Modal, View, Text, Button, StyleSheet } from 'react-native';
// import { settingsStore } from '@/store/store';

// export default function CustomModal() {
//     const [visible, setVisible] = useState(false);
//     const isDark = settingsStore.isDark

//     return (
//         <View>
//             <Button title="Show Alert" onPress={() => setVisible(true)} />
//             <Modal
//                 visible={visible}
//                 transparent={true}
//                 animationType="fade"
//                 onRequestClose={() => setVisible(false)}
//             >
//                 <View style={styles.overlay}>
//                     <View
//                         style={[
//                             styles.alertBox,
//                             isDark && styles.alertBoxDark,
//                         ]}
//                     >
//                         <Text
//                             style={[
//                                 styles.alertText,
//                                 isDark && styles.alertTextDark,
//                             ]}
//                         >
//                             Are you sure you want to proceed?
//                         </Text>
//                         <View style={styles.buttonRow}>
//                             <Button title="Cancel" onPress={() => setVisible(false)} />
//                             <Button title="Confirm" onPress={() => setVisible(false)} />
//                         </View>
//                     </View>
//                 </View>
//             </Modal>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     overlay: {
//         flex: 1,
//         backgroundColor: 'rgba(0, 0, 0, 0.6)',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     alertBox: {
//         width: 300,
//         backgroundColor: '#fff',
//         borderRadius: 10,
//         padding: 20,
//         alignItems: 'center',
//     },
//     alertBoxDark: {
//         backgroundColor: '#333',
//     },
//     alertText: {
//         fontSize: 16,
//         color: '#000',
//         marginBottom: 20,
//     },
//     alertTextDark: {
//         color: '#fff',
//     },
//     buttonRow: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         width: '100%',
//     },
// });
