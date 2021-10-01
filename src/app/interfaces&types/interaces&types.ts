export interface ILoggedinUserData {
    Username: string;
    Role: string;
    LastLogin: string;
    FirstName: string;
    LastName: string;
    EmployeeID: string;
    Level: string;
}

export interface IAccess {
    R: boolean;
    W: boolean;
    C: boolean;
    D: boolean;
}

export interface IAccessMapping {
    _id: string;
    Role: string;
    Level: string;
    Dashboard: {
      "Admin Dashboard": IAccess;
      "Employee Dashboard": IAccess;
    };
    Apps: {
      Chat: IAccess;
      Calls: IAccess;
      Calender: IAccess;
      Contacts: IAccess;
      Email: IAccess;
      "File Manager": IAccess;
    };
    Employees: {
      "All Employees": IAccess;
      Holidays: IAccess;
      "Leaves (Admin)": IAccess;
      "Leaves (Employee)": IAccess;
      "Leave Settings": IAccess;
      "Attendance (Admin)": IAccess;
      "Attendance (Employee)": IAccess;
      Departments: IAccess;
      Designations: IAccess;
      Timesheet: IAccess;
      "Shift & Schedule": IAccess;
      OverTime: IAccess;
    };
    Clients: IAccess;
    Projects: {
      Projects: IAccess;
      Tasks: IAccess;
      "Task Board": IAccess;
    };
    Leads: IAccess;
    Tickets: IAccess;
    Sales: {
      Estimates: IAccess;
      Invoice: IAccess;
      Payments: IAccess;
      Expenses: IAccess;
      "Provident Fund": IAccess;
      Taxes: IAccess;
    };
    Accounting: {
      Categories: IAccess;
      Budgets: IAccess;
      "Budget Expanses": IAccess;
      "Budget Revenues": IAccess;
    };
    Payroll: {
      "Employee Salary": IAccess;
      Payslip: IAccess;
      "Payroll Items": IAccess;
    };
  
    Policies: IAccess;
  
    Reports: {
      "Expense Report": IAccess;
      "Invoice Report": IAccess;
      "Payment Report": IAccess;
      "Project Report": IAccess;
      "Task Report": IAccess;
      "User Report": IAccess;
      "Employee Report": IAccess;
      "Payslip Report": IAccess;
      "Attendance Report": IAccess;
      "Leave Report": IAccess;
      "Daily Report": IAccess;
    };
  
    Performance: {
      "Performance Indicator": IAccess;
      "Performance Review": IAccess;
      "Performance Appraisal": IAccess;
    };
  
    Goals: {
      "Goal List": IAccess;
      "Goal Type": IAccess;
    };
  
    Training: {
      "Training List": IAccess;
      Trainers: IAccess;
      "Training Type": IAccess;
    };
    Promotion: IAccess;
    Resignation: IAccess;
    Termination: IAccess;
    Assests: IAccess;
    Jobs: {
      "User Dashboard": IAccess;
      "Jobs Dashboard": IAccess;
      "Manage Jobs": IAccess;
      "Manage Resume": IAccess;
      "Shortlist Candidates": IAccess;
      "Interview Questions": IAccess;
      "Offer Approvals": IAccess;
      "Experience Level": IAccess;
      "Candidate List": IAccess;
      "Schedule Timing": IAccess;
      "Aptitude Results": IAccess;
      "Applied Candidates": IAccess;
    };
    Knowledgsbase: IAccess;
    Activities: IAccess;
    Users: IAccess;
    Settings: {
      "Company Settings": IAccess;
      Localization: IAccess;
      "Theme Settings": IAccess;
      "Roles & Permissions": IAccess;
      "Email Settings": IAccess;
      "Performance Settings": IAccess;
      "Approval Settings": IAccess;
      "Invoice Settings": IAccess;
      "Salary Settings": IAccess;
      Notifications: IAccess;
      "Change Password": IAccess;
      "Leave Type": IAccess;
    };
  }