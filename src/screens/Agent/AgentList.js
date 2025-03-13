import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AddAgentModal from '../../components/Modal/AddAgentModal';
import { globalColors } from '../../Theme/globalColors';

const AgentList = () => {
    const [paginationVisible, setPaginationVisible] = useState(false);
    const [agents, setAgents] = useState([
        { id: '1', name: 'Agent 001', agentCode: 'AG001', rent: '0', fixedExpenses: '50', commission: '20' },
        { id: '2', name: 'Agent 002', agentCode: 'AG002', rent: '200', fixedExpenses: '70', commission: '18' },
        { id: '3', name: 'Agent 003', agentCode: 'AG003', rent: '300', fixedExpenses: '50', commission: '22' },
        { id: '4', name: 'Agent 004', agentCode: 'AG004', rent: '400', fixedExpenses: '60', commission: '24' },
        { id: '5', name: 'Agent 005', agentCode: 'AG005', rent: '500', fixedExpenses: '80', commission: '30' },
        { id: '6', name: 'Agent 006', agentCode: 'AG006', rent: '600', fixedExpenses: '90', commission: '28' },
        { id: '7', name: 'Agent 007', agentCode: 'AG007', rent: '150', fixedExpenses: '55', commission: '26' },
        { id: '8', name: 'Agent 008', agentCode: 'AG008', rent: '250', fixedExpenses: '65', commission: '27' },
        { id: '9', name: 'Agent 009', agentCode: 'AG009', rent: '350', fixedExpenses: '75', commission: '23' },
        { id: '10', name: 'Agent 010', agentCode: 'AG010', rent: '450', fixedExpenses: '85', commission: '19' },
        { id: '11', name: 'Agent 011', agentCode: 'AG011', rent: '500', fixedExpenses: '95', commission: '20' },
        { id: '12', name: 'Agent 012', agentCode: 'AG012', rent: '550', fixedExpenses: '60', commission: '21' },
        { id: '13', name: 'Agent 013', agentCode: 'AG013', rent: '650', fixedExpenses: '70', commission: '29' },
        { id: '14', name: 'Agent 014', agentCode: 'AG014', rent: '750', fixedExpenses: '80', commission: '25' },
        { id: '15', name: 'Agent 015', agentCode: 'AG015', rent: '850', fixedExpenses: '90', commission: '22' },
        { id: '16', name: 'Agent 016', agentCode: 'AG016', rent: '950', fixedExpenses: '100', commission: '24' },
        { id: '17', name: 'Agent 017', agentCode: 'AG017', rent: '1050', fixedExpenses: '110', commission: '30' },
        { id: '18', name: 'Agent 018', agentCode: 'AG018', rent: '1150', fixedExpenses: '120', commission: '26' },
        { id: '19', name: 'Agent 019', agentCode: 'AG019', rent: '1250', fixedExpenses: '130', commission: '28' },
        { id: '20', name: 'Agent 020', agentCode: 'AG020', rent: '1350', fixedExpenses: '140', commission: '25' },
    ]);

    const [modalVisible, setModalVisible] = useState(false);
    const [editAgent, setEditAgent] = useState(null);

    const handleEndReached = () => {
        setPaginationVisible(true);
    };

    // const handleAddAgent = () => {
    //     if (newAgent.name && newAgent.agentCode) {
    //         const newAgentList = [...agents, { ...newAgent, id: `${agents.length + 1}` }];
    //         setAgents(newAgentList);
    //         setNewAgent({ id: '', name: '', agentCode: '', rent: '', fixedExpenses: '', commission: '' });
    //         setModalVisible(false);
    //     } else {
    //         Alert.alert("Error", "Please fill in the required fields.");
    //     }
    // };

    const handleSave = (newAgent) => {
        if (editAgent && editAgent.id) {
            setAgents(agents.map(agent => (agent.id === editAgent.id ? { ...agent, ...newAgent } : agent)));
        } else {
            setAgents([...agents, { ...newAgent, id: Date.now() }]);
        }
        setModalVisible(false);
        setEditAgent(null);
    };


    const handleEditAgent = (item) => {
        setEditAgent(item);
        setModalVisible(true);
    };

    const handleSaveEditAgent = () => {
        if (editAgent) {
            const updatedAgents = agents.map(agent =>
                agent.id === editAgent.id ? editAgent : agent
            );
            setAgents(updatedAgents);
            setEditAgent(null);
            setModalVisible(false);
        }
    };

    const handleDeleteAgent = (id) => {
        const filteredAgents = agents.filter(agent => agent.id !== id);
        setAgents(filteredAgents);
    };

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Text style={[styles.itemText, styles.srNo]}>{item.id}</Text>
            <Text style={[styles.itemText, styles.name]}>{item.name}</Text>
            <Text style={[styles.itemText, styles.agentCode]}>{item.agentCode}</Text>
            <Text style={[styles.itemText, styles.rent]}>{item.rent}</Text>
            <Text style={[styles.itemText, styles.fixedExpenses]}>{item.fixedExpenses}</Text>
            <Text style={[styles.itemText, styles.commission]}>{item.commission}</Text>
            <View style={styles.actionContainer}>
                <TouchableOpacity style={styles.editButton} onPress={() => handleEditAgent(item)}>
                    <FontAwesome name="pencil" size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteAgent(item.id)}>
                    <FontAwesome name="trash" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>AGENT LIST</Text>
            <View style={styles.card}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                        <Text style={styles.buttonText}>ADD AGENT</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView horizontal>
                    <View style={styles.tableContainer}>
                        <View style={styles.tableHeader}>
                            <Text style={styles.tableHeaderText}>SR.NO</Text>
                            <Text style={styles.tableHeaderText}>NAME</Text>
                            <Text style={styles.tableHeaderText}>AGENT CODE</Text>
                            <Text style={styles.tableHeaderText}>RENT</Text>
                            <Text style={styles.tableHeaderText}>FIXED EXPENSES</Text>
                            <Text style={styles.tableHeaderText}>COMMISSION</Text>
                            <Text style={styles.tableHeaderText}>ACTION</Text>
                        </View>
                        <FlatList
                            data={agents}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id}
                            onEndReached={handleEndReached}
                            onEndReachedThreshold={0.1}
                        />
                    </View>
                </ScrollView>
                {/* {paginationVisible && (
                    <View style={styles.pagination}>
                        <TouchableOpacity style={styles.loadMoreButton}>
                            <Text style={styles.buttonText}>Load More</Text>
                        </TouchableOpacity>
                    </View>
                )} */}
            </View>
            <AddAgentModal modalVisible={modalVisible} setModalVisible={() => setModalVisible(false)} onSave={handleSave}
                editAgent={editAgent}
            />

        </ScrollView>
    );
};

const styles = {
    container: {
        backgroundColor: globalColors.white,
        padding: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: globalColors.black,
        marginBottom: 24,
    },
    card: {
        backgroundColor: globalColors.white,
        borderRadius: 12,
        padding: 10,
        shadowColor: globalColors.black,
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    addButton: {
        backgroundColor: globalColors.blue,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    buttonText: {
        color: globalColors.white,
        fontWeight: 'bold',
    },
    tableContainer: {
        minWidth: '100%',
        backgroundColor: globalColors.white,
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: globalColors.borderColor,
        paddingVertical: 12,
    },
    tableHeaderText: {
        color: globalColors.black,
        paddingHorizontal: 16,
        textAlign: 'left',
        fontWeight: 'bold',
    },
    itemContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: globalColors.borderColor,
        paddingVertical: 12,
    },
    itemText: {
        color: '#333',
        paddingHorizontal: 16,
        textAlign: 'left',
    },
    srNo: {
        width: 60,
    },
    name: {
        width: 120,
    },
    agentCode: {
        width: 120,
    },
    rent: {
        width: 100,
    },
    fixedExpenses: {
        width: 120,
    },
    commission: {
        width: 120,
    },
    actionContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    editButton: {
        backgroundColor: globalColors.pancypurple,
        padding: 8,
        borderRadius: 4,
        marginRight: 8,
    },
    deleteButton: {
        backgroundColor: globalColors.vividred,
        padding: 8,
        borderRadius: 4,
    },
};

export default AgentList;
