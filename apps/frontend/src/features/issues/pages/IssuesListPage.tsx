import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../../../store';
import {
  fetchIssues,
  selectIssues,
  selectIssuesLoading,
  selectSelectedIssue,
  selectIssue,
  deleteIssue,
  type Issue,
} from '../store/issuesSlice';
import { Button, Spinner, Select, Table, TableHead, TableHeadCell, TableBody, TableRow, TableCell } from 'flowbite-react';
import CreateIssueModal from './CreateIssueModal';
import Swal from 'sweetalert2';

export default function IssuesList() {
  const dispatch = useDispatch<AppDispatch>();
  const issues = useSelector(selectIssues);
  const loading = useSelector(selectIssuesLoading);
  const selectedIssue = useSelector(selectSelectedIssue);

  const [openModal, setOpenModal] = useState(false);
  const [issue, setIssue] = useState<Issue>({
    id: 0,
    title: '',
    description: '',
    priority: 'MEDIUM',
    status: 'OPEN',
  } as Issue);

  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');

  useEffect(() => {
    const filters: any = {};
    if (statusFilter !== 'ALL') filters.status = statusFilter;
    if (priorityFilter !== 'ALL') filters.priority = priorityFilter;

    dispatch(fetchIssues(filters));
  }, [dispatch, statusFilter, priorityFilter]);

  const deleteRow = async (id: number) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to delete this issue?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it",
        cancelButtonText: "Cancel",
      });

      if (!result.isConfirmed) return;

      await dispatch(deleteIssue(id)).unwrap();
      await dispatch(
        fetchIssues({
          status: statusFilter !== "ALL" ? statusFilter : undefined,
          priority: priorityFilter !== "ALL" ? priorityFilter : undefined,
        })
      );

      Swal.fire("Deleted!", "The issue has been deleted.", "success");
    } catch (error) {
      console.error("❌ Failed to delete issue:", error);

      Swal.fire("Error", "Issue could not be deleted.", "error");
    }
  };


  const editRow = (issue: Issue) => {
    setIssue(issue);
    setOpenModal(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner aria-label="Loading table..." color="purple" size="xl" />
      </div>
    );
  }

  return (
    <div className="p-6 w-full">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Issues</h1>
        <Button
          color="blue"
          onClick={() => {
            setIssue({
              id: 0,
              title: '',
              description: '',
              priority: 'MEDIUM',
              status: 'OPEN',
            } as Issue);
            setOpenModal(true);
          }}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
        >
          + Create Issue
        </Button>
      </div>

      {/* 🔹 Filters */}
      <div className="flex gap-4 mb-4">
        <Select
          className="w-40"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All Statuses</option>
          <option value="OPEN">Open</option>
          <option value="CLOSED">Closed</option>
        </Select>

        <Select
          className="w-40"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="ALL">All Priorities</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </Select>
      </div>



      <div className="bg-white shadow-md sm:rounded-lg">
        {/* fixed total height, vertical scroll on this container */}
        <div className="h-96 overflow-y-auto overflow-x-auto">

          <Table hoverable={true} className="min-w-full">

            {/* make header sticky so it remains while body scrolls */}
            <TableHead className="sticky top-0 bg-white/95 backdrop-blur z-10">
              <TableHeadCell>ID</TableHeadCell>
              <TableHeadCell>Title</TableHeadCell>
              <TableHeadCell>Status</TableHeadCell>
              <TableHeadCell>Priority</TableHeadCell>
              <TableHeadCell>Reporter</TableHeadCell>
              <TableHeadCell>Created</TableHeadCell>
              <TableHeadCell>Edit</TableHeadCell>
              <TableHeadCell>Delete</TableHeadCell>
            </TableHead>

            <TableBody className="divide-y">
              {!loading && issues.length === 0 ? (
                // give this row a fixed height that fills the scrolling area minus header
                // approximate header height with e.g. ~3rem; adjust if your header is taller
                <TableRow className="h-[21rem]">
                  <TableCell colSpan={8} className="flex items-center justify-center text-gray-400">
                    No issues found.
                  </TableCell>
                </TableRow>
              ) : (
                issues.map((issue) => (
                  <TableRow
                    key={issue.id}
                    onClick={() => dispatch(selectIssue(issue))}
                    className={`cursor-pointer ${selectedIssue?.id === issue.id ? "bg-blue-50" : ""}`}
                  >
                    <TableCell>{issue.id}</TableCell>
                    <TableCell className="font-medium text-gray-900">{issue.title}</TableCell>
                    <TableCell>{issue.status}</TableCell>
                    <TableCell className={`font-semibold ${issue.priority === "HIGH" ? "text-red-600" :
                      issue.priority === "MEDIUM" ? "text-yellow-600" : "text-green-600"
                      }`}>{issue.priority}</TableCell>
                    <TableCell className="text-gray-600">{issue.user?.name || "—"}</TableCell>
                    <TableCell className="text-gray-500">{new Date(issue.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <button
                        onClick={(e) => { e.stopPropagation(); editRow(issue); }}
                        className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded w-full"
                      >
                        Edit
                      </button>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteRow(issue.id); }}
                        className="text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded w-full"
                      >
                        Delete
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>

          </Table>
        </div>
      </div>


      <CreateIssueModal
        show={openModal}
        onClose={() => setOpenModal(false)}
        issue={issue}
        setIssue={setIssue}
      />
    </div>
  );
}
