import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useState } from 'react';

const EntriesList = ({
  reversedGroupedEntries,
  Delete,
  handleEdit,
  handleChangeMsg,
  resultnum,
  resultpan,
  userRole,
  marketResults,
  onSelectionChange,
  isLoading
}) => {
  const [selectedEntries, setSelectedEntries] = useState([]);


  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading entries...</Text>
      </View>
    );
  }

  if (!reversedGroupedEntries) return null;

  // Function to check if results are out for specific markets
  const isKalyanResultOut = marketResults?.some(result =>
    result.market === "Kalyan"
  );

  const isMumbaiResultOut = marketResults?.some(
    result => result.market === 'Mumbai',
  );

  // New helpers: detect open/close result declarations per market
  const isOpenResultDeclaredForMarket = (market) => {
    return marketResults?.some(r => r.market === market && (r.type === 'open-pan' || r.type === 'openpan'));
  };

  const isCloseResultDeclaredForMarket = (market) => {
    return marketResults?.some(r => r.market === market && (r.type === 'close-pan' || r.type === 'closepan'));
  };

  const openRestrictedTypes = new Set([
    'open',
    'jodi',
    'chokada',
    'cycle',
    'cut',
    'cut_open',
    'cut_close',
    'running_pan',
    'saral_pan',
    'ulta_pan',
    'beerich',
    'farak',
    'openpan',
  ]);

  const closeRestrictedTypes = new Set([
    'closepan',
    'close',
  ]);

  const shouldHideActions = (entry) => {
    const type = (entry?.type || '').toLowerCase();
    const market = entry?.market;
    const openDeclared = isOpenResultDeclaredForMarket(market);
    const closeDeclared = isCloseResultDeclaredForMarket(market);

    const isOpenRestricted = openRestrictedTypes.has(type) || type.startsWith('openpan');
    const isCloseRestricted = closeRestrictedTypes.has(type) || type.startsWith('closepan');

    if (openDeclared && isOpenRestricted) return true;
    if (closeDeclared && isCloseRestricted) return true;
    return false;
  };

  const handleEntrySelection = entry => {
    const isSelected = selectedEntries.some(e => e.id === entry.id);
    let newSelectedEntries;

    if (isSelected) {
      newSelectedEntries = selectedEntries.filter(e => e.id !== entry.id);
    } else {
      newSelectedEntries = [...selectedEntries, entry];
    }

    setSelectedEntries(newSelectedEntries);
    onSelectionChange(newSelectedEntries);
  };

  const formatNumbers = (entry, type) => {
    if (!entry) return "N/A";

    try {
      if (
        type === 'running_pan' ||
        type === 'beerich' ||
        type === 'farak' ||
        type === 'cycle' ||
        type === 'chokada'
      ) {
        const numbers = JSON.parse(entry.entry_number).join(', ');
        return numbers;
      } else if (type === 'jodi') {
        const numbers = JSON.parse(entry.number).join(', ');
        return numbers;
      } else if (
        type === 'openpan' ||
        type === 'openpan_dp' ||
        type === 'openpan_sp' ||
        type === 'openpan_tp'
      ) {
        const numbersArray = JSON.parse(entry.entry_number);
        return numbersArray
          .map(num => (num === resultpan ? num : num))
          .join(', ');
      } else if (
        type === 'closepan' ||
        type === 'closepan_dp' ||
        type === 'closepan_sp' ||
        type === 'closepan_tp'
      ) {
        return JSON.parse(entry.entry_number).join(', ');
      } else {
        const numbers = JSON.parse(entry.number).join(', ');
        if (type !== 'cut_close') {
          return numbers
            .split(',')
            .map(num => {
              const number = parseInt(num, 10);
              const firstDigit = number.toString().charAt(0);
              if (firstDigit === resultnum && type !== 'close') {
                return number;
              }
              return number;
            })
            .join(', ');
        }
        return numbers;
      }
    } catch (e) {
      return entry.number || entry.entry_number || 'N/A';
    }
  };

  const renderNormalEntries = entries => {
    return entries.map((entry, index) => {
      const isResultOut =
        entry.market === 'Kalyan'
          ? isKalyanResultOut
          : entry.market === 'Mumbai'
            ? isMumbaiResultOut
            : false;

      const isSelected = selectedEntries.some(e => e.id === entry.id);

      const hideActions = shouldHideActions(entry);

      return (
        <View
          key={`normal-${entry.id}-${index}`}
          style={[
            styles.cardStyle,
            { backgroundColor: entry.verified_by === 0 ? '#fff' : 'lightgreen' },
          ]}>
          <View style={styles.cardHeader}>
            {/* <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => handleEntrySelection(entry)}> */}
            {/* <View style={{ alignContent: 'center' }}>
              {isSelected && <Icon name="check" size={12} color="#fff" />}
            </View> */}
            {/* </TouchableOpacity> */}
            {/* <TouchableOpacity
              onPress={() => {
            }}> */}
            <Text style={styles.cardType}>{entry.type.toUpperCase()}</Text>
            {/* </TouchableOpacity> */}
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.numbers}>
              {formatNumbers(entry, entry.type)}
            </Text>
            <Text style={styles.amount}>₹ {entry.amount}</Text>
          </View>
          {entry.verified_by === 0 && !hideActions && (
            <View style={styles.cardActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleEdit(entry.id)}>
                <Icon name="edit" size={20} color="#0066FF" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => Delete(entry.id)}>
                <Icon name="trash" size={20} color="#FF0000" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      );
    });
  };

  const renderPanTableEntries = panEntries => {
    const childrenGrouped = {};
    const parents = {};

    panEntries.forEach(entry => {
      if (entry.type === 'saral_pan' || entry.type === 'ulta_pan') {
        if (entry.parent !== '0') {
          try {
            const parentIds = JSON.parse(entry.parent);
            const parentKey = JSON.stringify(parentIds);

            if (!childrenGrouped[parentKey]) {
              childrenGrouped[parentKey] = {
                children: [],
                type: entry.type,
                market: entry.market,
              };
            }
            childrenGrouped[parentKey].children.push(entry);
          } catch (e) {
            console.error('Error parsing parent IDs:', e);
          }
        } else {
          parents[entry.id] = entry;
        }
      }
    });

    return (
      <View style={styles.panContainer}>
        {Object.keys(childrenGrouped).map((parentKey, index) => {
          const parentIds = JSON.parse(parentKey);
          const type = childrenGrouped[parentKey].type;
          const market = childrenGrouped[parentKey].market;
          const children = childrenGrouped[parentKey].children;

          // Determine if results are out based on market
          const isResultOut =
            market === 'Kalyan'
              ? isKalyanResultOut
              : market === 'Mumbai'
                ? isMumbaiResultOut
                : false;

          const openDeclared = isOpenResultDeclaredForMarket(market);
          // saral_pan and ulta_pan are restricted on open result
          const hideActions = openDeclared;

          let parentContent = [];
          let childContent = [];

          parentIds.forEach(parentId => {
            if (parents[parentId]) {
              const parent = parents[parentId];
              const isHighlighted =
                (type === 'ulta_pan' && resultnum === parent.number) ||
                (type === 'saral_pan' && resultpan === parent.number);

              parentContent.push(
                <View key={`parent-${parentId}`} style={styles.panEntry}>
                  <Text
                    style={
                      isHighlighted ? styles.highlightedText : styles.normalText
                    }>
                    {parent.number}X{parent.amount}
                  </Text>
                </View>,
              );
            }
          });

          children.forEach(child => {
            childContent.push(
              <View key={`child-${child.id}`} style={styles.panEntry}>
                <Text style={styles.normalText}>
                  {child.number}X{child.amount}
                </Text>
              </View>,
            );
          });

          const mergedIds = [...parentIds, ...children.map(child => child.id)];
          const backgroundColor =
            parents[parentIds[0]]?.verified_by === 0 ? '#fff' : 'lightgreen';

          return (
            <View
              key={`pan-${index}`}
              style={[styles.cardStyle, { backgroundColor }]}>
              <View style={styles.cardHeader}>
                <TouchableOpacity
                  onPress={() => {
                    /* verify_status would go here */
                  }}>
                  <Text style={styles.cardType}>
                    {type.toUpperCase()} ({market})
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.panContent}>
                {parentContent}
                {childContent}
              </View>
              {parents[parentIds[0]]?.verified_by === 0 && !hideActions && (
                <View style={styles.cardActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => Delete(JSON.stringify(mergedIds))}>
                    <Icon name="trash" size={20} color="#FF0000" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}
      </View>
    );
  };

  const renderAllEntries = () => {
    const allEntries = [];
    Object.values(reversedGroupedEntries).forEach(group => {
      Object.values(group).forEach(entry => {
        if (typeof entry === 'object' && entry !== null && 'id' in entry) {
          allEntries.push(entry);
        }
      });
    });

    const normalEntries = allEntries.filter(
      entry => entry.type !== 'saral_pan' && entry.type !== 'ulta_pan',
    );

    const panEntries = allEntries.filter(
      entry => entry.type === 'saral_pan' || entry.type === 'ulta_pan',
    );

    return (
      <View style={styles.container}>
        {renderNormalEntries(normalEntries)}
        {renderPanTableEntries(panEntries)}
      </View>
    );
  };

  return (
    <ScrollView style={styles.scrollContainer}>{renderAllEntries()}</ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardStyle: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#000',
    width: '48%',
  },
  panCard: {
    width: '100%',
    marginBottom: 15,
  },
  cardHeader: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    alignItems: 'center',
    flex: 1,
    flexDirection: "row"
  },
  cardType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    alignSelf: 'center'
    // marginLeft: 20,
  },
  cardContent: {
    padding: 10,
  },
  panContent: {
    padding: 10,
  },
  panEntry: {
    marginBottom: 5,
  },
  numbers: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  highlightedText: {
    color: 'red',
  },
  normalText: {
    color: '#333',
  },
  amount: {
    fontSize: 14,
    color: '#666',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  actionButton: {
    marginLeft: 15,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: '#0066FF',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checked: {
    backgroundColor: '#0066FF',
  },
  panContainer: {
    flexDirection: 'row',
    width: '100%',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});

export default EntriesList;
