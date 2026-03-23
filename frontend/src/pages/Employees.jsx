import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, ChevronLeft, ChevronRight, FileDown } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import EmployeeForm from '../components/employees/EmployeeForm';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEmployees, setTotalEmployees] = useState(0);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  
  // Form modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      let url = `/employees?page=${page}&limit=10`;
      if (searchTerm) url += `&search=${searchTerm}`;
      if (roleFilter) url += `&role=${roleFilter}`;
      if (deptFilter) url += `&department=${deptFilter}`;
      
      const { data } = await api.get(url);
      setEmployees(data.employees);
      setTotalPages(data.pages);
      setTotalEmployees(data.total);
    } catch (error) {
      toast.error('Failed to fetch employees');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEmployees();
    }, 300); // Debounce search
    return () => clearTimeout(timer);
  }, [page, searchTerm, roleFilter, deptFilter]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await api.delete(`/employees/${id}`);
        toast.success('Employee deleted successfully');
        if (employees.length === 1 && page > 1) {
          setPage(page - 1);
        } else {
          fetchEmployees();
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete employee');
      }
    }
  };

  const openForm = (employee = null) => {
    setCurrentEmployee(employee);
    setIsFormOpen(true);
  };

  const closeFormAndRefresh = () => {
    setIsFormOpen(false);
    setCurrentEmployee(null);
    fetchEmployees();
  };

  const exportCSV = () => {
    const headers = ['Name,Email,Phone,Role,Department,Salary,Status,Joining Date\n'];
    const csvContent = employees.map(emp => {
      return `"${emp.name}","${emp.email}","${emp.phone}","${emp.role}","${emp.department}",${emp.salary},"${emp.status}","${new Date(emp.joiningDate).toLocaleDateString()}"`;
    }).join('\n');

    const blob = new Blob([headers + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `employees_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Employees</h1>
          <p className="mt-1 text-sm text-slate-500">Manage your team members and their account permissions here.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button 
            onClick={exportCSV}
            className="flex-1 sm:flex-none inline-flex items-center justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 transition-all"
          >
            <FileDown className="-ml-1 mr-2 h-4 w-4 text-slate-500 text-indigo-600" />
            <span className="whitespace-nowrap">Export CSV</span>
          </button>
          <button
            onClick={() => openForm()}
            className="flex-1 sm:flex-none inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all"
          >
            <Plus className="-ml-1 mr-2 h-4 w-4" />
            <span className="whitespace-nowrap">Add Employee</span>
          </button>
        </div>
      </div>

      <div className="rounded-2xl bg-white shadow-[0_2px_10px_rgb(0,0,0,0.04)] ring-1 ring-slate-200 overflow-hidden">
        {/* Toolbar */}
        <div className="border-b border-slate-200 p-4 sm:flex sm:items-center sm:justify-between gap-4 bg-slate-50/50">
          <div className="relative flex-1 max-w-md w-full mb-3 sm:mb-0">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-slate-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full rounded-xl border-0 py-2.5 pl-10 pr-3 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all shadow-sm"
            />
          </div>
          
          <div className="flex sm:mt-0 gap-3 w-full sm:w-auto">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="block w-full sm:w-auto rounded-xl border-0 py-2.5 pl-3 pr-10 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 shadow-sm"
            >
              <option value="">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Developer">Developer</option>
              <option value="HR">HR</option>
              <option value="Other">Other</option>
            </select>
            
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="block w-full sm:w-auto rounded-xl border-0 py-2.5 pl-3 pr-10 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 shadow-sm"
            >
              <option value="">All Depts</option>
              <option value="Engineering">Engineering</option>
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
              <option value="HR">HR</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[300px]">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50/80">
              <tr>
                <th scope="col" className="py-4 pl-4 pr-3 text-left text-[11px] font-semibold text-slate-500 sm:pl-6 uppercase tracking-wider">Employee</th>
                <th scope="col" className="px-3 py-4 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Contact</th>
                <th scope="col" className="px-3 py-4 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Role & Dept</th>
                <th scope="col" className="px-3 py-4 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="relative py-4 pl-3 pr-4 sm:pr-6"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600"></div>
                      <p className="mt-4 text-sm text-slate-500">Loading employees...</p>
                    </div>
                  </td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-20 text-center flex-col items-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 mb-4">
                      <Search className="h-8 w-8 text-slate-400" />
                    </div>
                    <p className="text-base font-medium text-slate-900">No employees found</p>
                    <p className="text-sm text-slate-500 mt-1">Try adjusting your search or filters.</p>
                  </td>
                </tr>
              ) : (
                employees.map((employee) => (
                  <tr key={employee._id} className="hover:bg-slate-50 transition-colors group">
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 font-bold shadow-sm ring-1 ring-inset ring-indigo-200/50">
                            {employee.name.charAt(0)}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="font-semibold text-slate-900">{employee.name}</div>
                          <div className="text-slate-500 text-xs mt-0.5 font-medium">Joined: {new Date(employee.joiningDate).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                      <div className="text-slate-900 font-medium">{employee.email}</div>
                      <div className="mt-0.5">{employee.phone}</div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                      <div className="text-slate-900 flex items-center gap-2">
                        <span className="font-semibold">{employee.role}</span>
                        <span className="text-slate-300">•</span>
                        <span>{employee.department}</span>
                      </div>
                      <div className="mt-1 font-medium text-emerald-600">${employee.salary?.toLocaleString() || '0'}/yr</div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold ${
                        employee.status === 'Active' ? 'bg-emerald-100 text-emerald-800 ring-1 ring-inset ring-emerald-600/20' : 'bg-slate-100 text-slate-800 ring-1 ring-inset ring-slate-500/20'
                      }`}>
                        {employee.status}
                      </span>
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openForm(employee)}
                          className="text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 p-2 rounded-lg transition-colors ring-1 ring-transparent hover:ring-indigo-100 shadow-sm"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(employee._id)}
                          className="text-rose-600 hover:text-rose-900 hover:bg-rose-50 p-2 rounded-lg transition-colors ring-1 ring-transparent hover:ring-rose-100 shadow-sm"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && employees.length > 0 && (
          <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/50 px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="relative inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="relative ml-3 inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-slate-700">
                  Showing <span className="font-semibold text-slate-900">{(page - 1) * 10 + 1}</span> to <span className="font-semibold text-slate-900">{Math.min(page * 10, totalEmployees)}</span> of{' '}
                  <span className="font-semibold text-slate-900">{totalEmployees}</span> results
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-xl shadow-sm bg-white" aria-label="Pagination">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="relative inline-flex items-center rounded-l-xl px-3 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 transition-colors"
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setPage(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset focus:z-20 focus:outline-offset-0 transition-colors ${
                        page === i + 1
                          ? 'bg-indigo-600 text-white ring-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 z-10'
                          : 'text-slate-900 ring-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="relative inline-flex items-center rounded-r-xl px-3 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 transition-colors"
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {isFormOpen && (
        <EmployeeForm
          employee={currentEmployee}
          onClose={closeFormAndRefresh}
        />
      )}
    </div>
  );
};

export default Employees;
