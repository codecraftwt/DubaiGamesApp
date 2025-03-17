import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { globalColors } from '../../Theme/globalColors';

const AddAgentModal = ({ modalVisible, setModalVisible, onSave, editAgent }) => {
    const [agent, setAgent] = useState({
        name: '',
        agentCode: '',
        staff: '',
        rent: '',
        fixedExpenses: '',
        agentType: '',
        commission: '',
        fields: {
            open: '', close: '', jodi: '', openClosePan: '', sp: '',
            dp: '', tp: '', chokadaCycle: '', cut: '',
            runningPan: '', saralPan: '', ultaPan: '', farak: '', beerich: ''
        }
    });

    const defaultAgent = {
        name: '',
        agentCode: '',
        staff: '',
        rent: '',
        fixedExpenses: '',
        agentType: '',
        commission: '',
        fields: {
            open: '', close: '', jodi: '', openClosePan: '', sp: '',
            dp: '', tp: '', chokadaCycle: '', cut: '',
            runningPan: '', saralPan: '', ultaPan: '', farak: '', beerich: ''
        }
    };

    // useEffect(() => {
    //     if (editAgent) {
    //         setAgent(editAgent);
    //     } else {
    //         setAgent({
    //             name: '',
    //             agentCode: '',
    //             staff: '',
    //             rent: '',
    //             fixedExpenses: '',
    //             agentType: '',
    //             commission: '',
    //             fields: {
    //                 open: '', close: '', jodi: '', openClosePan: '', sp: '',
    //                 dp: '', tp: '', chokadaCycle: '', cut: '',
    //                 runningPan: '', saralPan: '', ultaPan: '', farak: '', beerich: ''
    //             }
    //         });
    //     }
    // }, [editAgent]);


    useEffect(() => {
        if (editAgent) {
            setAgent({
                ...defaultAgent,  // Ensure all keys exist
                ...editAgent,     // Override only the values present in editAgent
                fields: { ...defaultAgent.fields, ...editAgent.fields } // Merge nested fields
            });
        } else {
            setAgent(defaultAgent);
        }
    }, [editAgent]);

    const handleInputChange = (field, value) => {
        setAgent(prevState => ({ ...prevState, [field]: value }));
    };

    const handleFieldChange = (field, value) => {
        setAgent(prevState => ({
            ...prevState,
            fields: { ...prevState.fields, [field]: value }
        }));
    };

    return (
        <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>{editAgent ? 'Edit Agent' : 'Add Agent'}</Text>
                    <ScrollView>
                        {['name', 'agentCode', 'staff', 'rent', 'fixedExpenses', 'commission', 'agentType'].map((field) => (
                            <TextInput
                                key={field}
                                style={styles.input}
                                placeholder={field.replace(/([A-Z])/g, ' $1').trim()}
                                value={agent[field]}
                                onChangeText={(text) => handleInputChange(field, text)}
                            />
                        ))}
                        <View style={styles.gridContainer}>
                            {Object?.keys(agent.fields).map((key) => (
                                <TextInput
                                    key={key}
                                    style={styles.smallInput}
                                    placeholder={key.replace(/([A-Z])/g, ' $1').trim()}
                                    value={agent.fields[key]}
                                    onChangeText={(text) => handleFieldChange(key, text)}
                                />
                            ))}
                        </View>
                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={styles.saveButton} onPress={() => onSave(agent)}>
                                <Text style={styles.buttonText}>{editAgent ? 'Update' : 'Register'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                                <Text style={styles.buttonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalContent: {
        width: '90%',
        backgroundColor: globalColors.white,
        padding: 20,
        borderRadius: 10
    },
    modalTitle: {
        fontSize: 18,
        fontFamily: 'Poppins-Bold',
        marginBottom: 8
    },
    input: {
        borderWidth: 1,
        borderColor: globalColors.borderColor,
        padding: 8,
        fontFamily: 'Poppins-Medium',
        marginBottom: 10,
        borderRadius: 5
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    },
    smallInput: {
        width: '30%',
        borderWidth: 1,
        borderColor: globalColors.borderColor,
        padding: 10,
        marginBottom: 10,
        borderRadius: 5
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10
    },
    saveButton: {
        backgroundColor: globalColors.blue,
        padding: 10,
        borderRadius: 5
    },
    closeButton: {
        backgroundColor: globalColors.Charcoal,
        padding: 10,
        borderRadius: 5
    },
    buttonText: {
        color: globalColors.white,
        textAlign: 'center',
        fontFamily: 'Poppins-Bold'
    }
});

export default AddAgentModal;
