import { IAccess, IAccessMapping } from "src/app/interfaces&types/interaces&types";

export interface ITreeTableData {
    module: string,
    subModule: string,
    R: boolean,
    W: boolean,
    C: boolean,
    D: boolean,
}

export class RoleDataFormatter {
    public async rawDataToTreeTable(data: any): Promise<ITreeTableData[]> {
        let dataArray: ITreeTableData[] = [];
        let keys = await this.getKeys(data);
        for (let k of keys) {
            // console.log(data[k])
            if(!data[k]) continue;
            if (data[k]?.hasOwnProperty("R")) {
                dataArray.push({
                    module: k,
                    subModule: "",
                    R: data[k].R,
                    W: data[k].W,
                    C: data[k].C,
                    D: data[k].D,
                })
            } else {
                // let temp = await this.rawDataToTreeTable(data[k]);
                // dataArray = dataArray.concat(temp);
                let keys1 = await this.getKeys(data[k]);
                for (let j of keys1) {
                    // console.log(data[k][j].hasOwnProperty("R"))
                    if (data[k][j]?.hasOwnProperty("R")) {
                        dataArray.push({
                            module: k,
                            subModule: j,
                            R: data[k][j].R,
                            W: data[k][j].W,
                            C: data[k][j].C,
                            D: data[k][j].D,
                        })
                    }
                }
            }
        }
        return dataArray;
    }

    public async treeTableToRawData(data: { Role: string, Level: string, _id?: string, AccessList: ITreeTableData[] }): Promise<IAccessMapping> {
        let accessData = new AccessMapping();
        accessData._id = data._id;
        accessData.Level = data.Level;
        accessData.Role = data.Role;
        for (let row of data.AccessList) {
            if (!row.subModule && row.subModule == '') {
                !accessData[row.module] ? accessData[row.module] = {} : '';
                accessData[row.module].R = row.R;
                accessData[row.module].C = row.C;
                accessData[row.module].W = row.W;
                accessData[row.module].D = row.D;
            } else {
                !accessData[row.module] ? accessData[row.module] = {} : '';
                !accessData[row.module][row.subModule] ? accessData[row.module][row.subModule] = {} : '';
                accessData[row.module][row.subModule].R = row.R;
                accessData[row.module][row.subModule].C = row.C;
                accessData[row.module][row.subModule].W = row.W;
                accessData[row.module][row.subModule].D = row.D;
            }
        }
        return accessData;
    }

    async newRole(): Promise<{ Role: string, Level: string, _id?: string, AccessList: ITreeTableData[] }> {
        let accessObj = new AccessMapping();
        accessObj._id = undefined;
        accessObj.Role = "";
        accessObj.Level = "";
        let temp = {
            AccessList: await this.rawDataToTreeTable(accessObj),
            Level: accessObj.Level,
            Role: accessObj.Role,
            _id: accessObj._id
        }
        return temp;
    }

    private async getKeys(dataObject: any): Promise<string[]> {
        let keys = Object.keys(dataObject);
        return keys;
    }
}

export class AccessMapping implements IAccessMapping {
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
    constructor() {
        this.Dashboard = {
            "Admin Dashboard": this.getDefaultAccess(),
            "Employee Dashboard": this.getDefaultAccess(),
        };
        this.Apps = {
            Chat: this.getDefaultAccess(),
            Calls: this.getDefaultAccess(),
            Calender: this.getDefaultAccess(),
            Contacts: this.getDefaultAccess(),
            Email: this.getDefaultAccess(),
            "File Manager": this.getDefaultAccess(),
        };
        this.Employees = {
            "All Employees": this.getDefaultAccess(),
            Holidays: this.getDefaultAccess(),
            "Leaves (Admin)": this.getDefaultAccess(),
            "Leaves (Employee)": this.getDefaultAccess(),
            "Leave Settings": this.getDefaultAccess(),
            "Attendance (Admin)": this.getDefaultAccess(),
            "Attendance (Employee)": this.getDefaultAccess(),
            Departments: this.getDefaultAccess(),
            Designations: this.getDefaultAccess(),
            Timesheet: this.getDefaultAccess(),
            "Shift & Schedule": this.getDefaultAccess(),
            OverTime: this.getDefaultAccess(),
        };
        this.Clients = this.getDefaultAccess(),
        this.Projects = {
            Projects: this.getDefaultAccess(),
            Tasks: this.getDefaultAccess(),
            "Task Board": this.getDefaultAccess(),
        };
        this.Leads = this.getDefaultAccess();
        this.Tickets = this.getDefaultAccess();
        this.Sales = {
            Estimates: this.getDefaultAccess(),
            Invoice: this.getDefaultAccess(),
            Payments: this.getDefaultAccess(),
            Expenses: this.getDefaultAccess(),
            "Provident Fund": this.getDefaultAccess(),
            Taxes: this.getDefaultAccess(),
        };
        this.Accounting = {
            Categories : this.getDefaultAccess(),
            Budgets: this.getDefaultAccess(),
            "Budget Expanses": this.getDefaultAccess(),
            "Budget Revenues": this.getDefaultAccess(),
        };
        this.Payroll = {
            "Employee Salary": this.getDefaultAccess(),
            Payslip: this.getDefaultAccess(),
            "Payroll Items": this.getDefaultAccess(),
        };
        this.Policies = this.getDefaultAccess(),
        this.Reports = {
            "Expense Report": this.getDefaultAccess(),
            "Invoice Report": this.getDefaultAccess(),
            "Payment Report": this.getDefaultAccess(),
            "Project Report": this.getDefaultAccess(),
            "Task Report": this.getDefaultAccess(),
            "User Report": this.getDefaultAccess(),
            "Employee Report": this.getDefaultAccess(),
            "Payslip Report": this.getDefaultAccess(),
            "Attendance Report": this.getDefaultAccess(),
            "Leave Report": this.getDefaultAccess(),
            "Daily Report": this.getDefaultAccess(),
        };

        this.Performance = {
            "Performance Indicator": this.getDefaultAccess(),
            "Performance Review": this.getDefaultAccess(),
            "Performance Appraisal": this.getDefaultAccess(),
        };

        this.Goals = {
            "Goal List": this.getDefaultAccess(),
            "Goal Type": this.getDefaultAccess(),
        };

        this.Training = {
            "Training List": this.getDefaultAccess(),
            Trainers: this.getDefaultAccess(),
            "Training Type": this.getDefaultAccess(),
        };
        this.Promotion = this.getDefaultAccess();
        this.Resignation = this.getDefaultAccess();
        this.Termination = this.getDefaultAccess();
        this.Assests = this.getDefaultAccess();
        this.Jobs = {
            "User Dashboard": this.getDefaultAccess(),
            "Jobs Dashboard": this.getDefaultAccess(),
            "Manage Jobs": this.getDefaultAccess(),
            "Manage Resume": this.getDefaultAccess(),
            "Shortlist Candidates": this.getDefaultAccess(),
            "Interview Questions": this.getDefaultAccess(),
            "Offer Approvals": this.getDefaultAccess(),
            "Experience Level": this.getDefaultAccess(),
            "Candidate List": this.getDefaultAccess(),
            "Schedule Timing": this.getDefaultAccess(),
            "Aptitude Results": this.getDefaultAccess(),
            "Applied Candidates": this.getDefaultAccess(),
        };
        this.Knowledgsbase = this.getDefaultAccess();
        this.Activities = this.getDefaultAccess();
        this.Users = this.getDefaultAccess(),
            this.Settings = {
                "Company Settings": this.getDefaultAccess(),
                Localization: this.getDefaultAccess(),
                "Theme Settings": this.getDefaultAccess(),
                "Roles & Permissions": this.getDefaultAccess(),
                "Email Settings": this.getDefaultAccess(),
                "Performance Settings": this.getDefaultAccess(),
                "Approval Settings": this.getDefaultAccess(),
                "Invoice Settings": this.getDefaultAccess(),
                "Salary Settings": this.getDefaultAccess(),
                Notifications: this.getDefaultAccess(),
                "Change Password": this.getDefaultAccess(),
                "Leave Type": this.getDefaultAccess(),
            };
    }
    private getDefaultAccess(): IAccess {
        let a: IAccess = {
            C: false,
            D: false,
            R: false,
            W: false,
        };
        return a;
    }
}