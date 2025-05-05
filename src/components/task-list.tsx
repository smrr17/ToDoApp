import React, {useCallback, useEffect, useRef} from 'react';
import {AnimatePresence, View} from 'moti';
import {PanGestureHandlerProps, ScrollView} from 'react-native-gesture-handler';
import TaskItem from './task-item';
import {makeStyledComponent} from '../utils/styled';

const StyledView = makeStyledComponent(View);
const StyledScrollView = makeStyledComponent(ScrollView);

interface TaskItemData {
  id: string;
  subject: string;
  done: boolean;
  isNew?: boolean; // Optional property to indicate if the task is new
  // Optional function to set data
}

interface TaskListProps {
  data: Array<TaskItemData>;
  editingItemId: string | null;
  onToggleItem: (item: TaskItemData) => void;
  onChangeSubject: (item: TaskItemData, newSubject: string) => void;
  onFinishEditing: (item: TaskItemData) => void;
  onPressLabel: (item: TaskItemData) => void;
  onRemoveItem: (item: TaskItemData) => void;
  setData?: (data: TaskItemData) => void;
}

interface TaskItemProps
  extends Pick<PanGestureHandlerProps, 'simultaneousHandlers'> {
  data: TaskItemData;
  isEditing: boolean;
  onToggleItem: (item: TaskItemData) => void;
  onChangeSubject: (item: TaskItemData, newSubject: string) => void;
  onFinishEditing: (item: TaskItemData) => void;
  onPressLabel: (item: TaskItemData) => void;
  onRemove: (item: TaskItemData) => void;
  setData?: (data: TaskItemData) => void;
}

const AnimatedTaskItem = (props: TaskItemProps) => {
  const {
    simultaneousHandlers,
    data,
    isEditing,
    onToggleItem,
    onChangeSubject,
    onFinishEditing,
    onPressLabel,
    onRemove,
    setData,
  } = props;
  const handleToggleCheckbox = useCallback(() => {
    onToggleItem(data);
  }, [data, onToggleItem]);
  const handleChangeSubject = useCallback(
    (subject: string) => {
      onChangeSubject(data, subject);
    },
    [data, onChangeSubject],
  );

  const previousValueRef = useRef(data.subject);
  console.log('prev--->', previousValueRef);
  const handleFinishEditing = useCallback(() => {
    console.log('finish editing');
    onFinishEditing(data);
    if (!data.subject && data.isNew) {
      console.log('empty subject');
      // If the subject is empty, remove the item

      onRemove(data);
      return;
    } else if (data.subject.length === 0) {
      console.log('empty subject');
      setData((prevData: any) => {
        const newData = [...prevData];
        const index = prevData.indexOf(data);

        newData[index] = {
          ...data,
          subject: previousValueRef.current,
          done: false,
          isNew: false,
        };
        console.log('newData--->', JSON.stringify(newData, null, 2));
        return newData;
      });
      console.log('subject changed');
      // If th
      // }e subject is changed, update the subject
    }
  }, [data, onFinishEditing, isEditing]);
  const handlePressLabel = useCallback(() => {
    onPressLabel(data);
  }, [data, onPressLabel]);
  const handleRemove = useCallback(() => {
    onRemove(data);
  }, [data, onRemove]);

  useEffect(() => {
    return () => {
      // Cleanup function to reset the editing state
      if (!data.subject && data.isNew) {
        onRemove(data);
      } else if (data.subject.length === 0) {
        setData((prevData: any) => {
          const newData = [...prevData];
          const index = prevData.indexOf(data);

          newData[index] = {
            ...data,
            subject: previousValueRef.current,
            done: false,
            isNew: false,
          };
          console.log('newData--->', JSON.stringify(newData, null, 2));
          return newData;
        });
      }
    };
  }, [isEditing, data]);
  return (
    <StyledView
      w="full"
      from={{
        opacity: 0,
        scale: 0.5,
        marginBottom: -46,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        marginBottom: 0,
      }}
      exit={{
        opacity: 0,
        scale: 0.5,
        marginBottom: -46,
      }}>
      <TaskItem
        simultaneousHandlers={simultaneousHandlers}
        subject={data.subject}
        isDone={data.done}
        isEditing={isEditing}
        onToggleCheckbox={handleToggleCheckbox}
        onChangeSubject={handleChangeSubject}
        onFinishEditing={handleFinishEditing}
        onPressLabel={handlePressLabel}
        onRemove={handleRemove}
      />
    </StyledView>
  );
};

const TaskList = (props: TaskListProps) => {
  const {
    data,
    editingItemId,
    onToggleItem,
    onChangeSubject,
    onFinishEditing,
    onPressLabel,
    onRemoveItem,
    setData,
  } = props;
  const refScrollView = useRef(null);

  return (
    <StyledScrollView ref={refScrollView} w="full">
      <AnimatePresence>
        {data.map(item => (
          <AnimatedTaskItem
            key={item.id}
            data={item}
            simultaneousHandlers={refScrollView}
            isEditing={item.id === editingItemId}
            onToggleItem={onToggleItem}
            onChangeSubject={onChangeSubject}
            onFinishEditing={onFinishEditing}
            onPressLabel={onPressLabel}
            onRemove={onRemoveItem}
            setData={setData}
          />
        ))}
      </AnimatePresence>
    </StyledScrollView>
  );
};

export default TaskList;
