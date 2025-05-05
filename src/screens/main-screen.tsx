import React, {useCallback, useState} from 'react';
import {Icon, VStack, useColorModeValue, Fab} from 'native-base';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AnimatedColorBox from '../components/animated-color-box';
import TaskList from '../components/task-list';
import shortid from 'shortid';
import Masthead from '../components/masthead';
import NavBar from '../components/navbar';
import {View} from 'react-native';

type Task = {
  id: string;
  subject: string;
  done: boolean;
  isNew?: boolean;
};

const initialData: Task[] = [
  {
    id: shortid.generate(),
    subject: 'Buy movie tickets for Friday',
    done: false,
  },
  {
    id: shortid.generate(),
    subject: 'Make a React Native tutorial',
    done: false,
  },
];

const MainScreen = () => {
  const [data, setData] = useState(initialData);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const handleToggleTaskItem = useCallback(item => {
    setData(prevData => {
      const newData = [...prevData];
      const index = prevData.indexOf(item);
      newData[index] = {
        ...item,
        done: !item.done,
      };
      return newData;
    });
  }, []);
  const handleChangeTaskItemSubject = useCallback((item, newSubject) => {
    setData(prevData => {
      const newData = [...prevData];
      const index = prevData.indexOf(item);

      newData[index] = {
        ...item,
        subject: newSubject,
        done: false,
        isNew:
          newData[index]?.isNew == false || newData[index]?.isNew == undefined
            ? false
            : newSubject?.length === 0,
      };
      console.log('newData--->', JSON.stringify(newData, null, 2));
      return newData;
    });
  }, []);
  const handleFinishEditingTaskItem = useCallback(_item => {
    setEditingItemId(null);
  }, []);
  const handlePressTaskItemLabel = useCallback(item => {
    setEditingItemId(item.id);
  }, []);
  const handleRemoveItem = useCallback(item => {
    setData(prevData => {
      const newData = prevData.filter(i => i !== item);
      return newData;
    });
  }, []);

  return (
    <AnimatedColorBox
      flex={1}
      bg={useColorModeValue('warmGray.50', 'primary.900')}
      w="full">
      <Masthead
        title="What's up, Sam!"
        image={require('../assets/masthead.png')}>
        <NavBar />
      </Masthead>
      <VStack
        flex={1}
        space={1}
        bg={useColorModeValue('warmGray.50', 'primary.900')}
        mt="-20px"
        borderTopLeftRadius="20px"
        borderTopRightRadius="20px"
        pt="20px">
        <TaskList
          data={data}
          onToggleItem={handleToggleTaskItem}
          onChangeSubject={handleChangeTaskItemSubject}
          onFinishEditing={handleFinishEditingTaskItem}
          onPressLabel={handlePressTaskItemLabel}
          onRemoveItem={handleRemoveItem}
          editingItemId={editingItemId}
          setData={setData}
        />
      </VStack>

      <Fab
        position="absolute"
        bottom={20}
        right={25}
        renderInPortal={false}
        size="md"
        icon={
          <Icon
            as={<AntDesign name="plus" />}
            size="lg"
            color="warmGray.50"
            _dark={{color: 'warmGray.50'}}
          />
        }
        colorScheme={useColorModeValue('blue', 'darkBlue')}
        bg={useColorModeValue('blue.500', 'blue.400')}
        onPress={() => {
          const id = shortid.generate();
          setData([
            {
              id,
              subject: '',
              done: false,
              isNew: true,
            },
            ...data,
          ]);
          setEditingItemId(id);
        }}
      />
    </AnimatedColorBox>
  );
};

export default MainScreen;
