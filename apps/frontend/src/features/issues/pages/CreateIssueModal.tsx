import { useEffect, useState } from 'react';
import {
  Button,
  Label,
  Modal,
  TextInput,
  Select,
  ModalBody,
  ModalHeader,
  Spinner,
} from 'flowbite-react';
import { useAppDispatch } from '../../../store';
import {
  createIssue,
  fetchIssues,
  selectIssuesLoading,
  updateIssue,
  type Issue,
} from '../store/issuesSlice';
import { useSelector } from 'react-redux';

interface CreateIssueModalProps {
  show: boolean;
  issue: Issue;
  onClose: () => void;
  setIssue: React.Dispatch<React.SetStateAction<Issue>>;
}

export interface IssueFormData {
  id?: number;
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
}

export default function CreateIssueModal({
  show,
  onClose,
  issue,
  setIssue,
}: CreateIssueModalProps) {
  const dispatch = useAppDispatch();
  const loading = useSelector(selectIssuesLoading);

  const [formData, setFormData] = useState<IssueFormData>({
    id: 0,
    title: '',
    description: '',
    priority: 'MEDIUM',
  });

  useEffect(() => {
    const obj = issue ? issue : {};
    setFormData((prev) => ({ ...prev, ...obj }));
  }, [issue]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let result;

      if (!formData.id) {
        result = await dispatch(
          createIssue(formData as Omit<Issue, 'id' | 'createdAt' | 'updatedAt'>)
        ).unwrap();
      } else {
        result = await dispatch(
          updateIssue({
            id: formData.id,
            data: {
              title: formData.title,
              description: formData.description,
              priority: formData.priority,
            },
          })
        ).unwrap();
      }
      if (result.success) {
        dispatch(fetchIssues());
        setFormData({
          title: '',
          description: '',
          priority: 'MEDIUM',
        });
        if (formData.id) {
          setIssue({ id: 0, title: '', description: '', priority: 'MEDIUM' });
        }
        onClose();
      }
    } catch (error) {
      console.error('❌ Failed to create issue:', error);
    }
  };

  return (
    <Modal show={show} onClose={onClose} size="xl">
      <ModalHeader>Create New Issue</ModalHeader>
      <ModalBody>
        <div className="w-[700px]">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="title">Title</Label>
              <TextInput
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter issue title"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <TextInput
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter issue description"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </Select>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="submit" color="blue">
                {loading ? (
                  <div className="flex items-center">
                    <Spinner aria-label="Loading..." color="purple" size="sm" className="mr-2" />
                    {formData?.id ? 'Updating...' : 'Creating...'}
                  </div>
                ) : formData?.id ? (
                  'Update'
                ) : (
                  'Create'
                )}
              </Button>
              <Button color="gray" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </ModalBody>
    </Modal>
  );
}
