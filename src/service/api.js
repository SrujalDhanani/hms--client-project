import axios from "axios";
import { encryption } from "../components/utils/utils.js";
import { getApiBase } from "../env.js";
import Cookies from "js-cookie";

const api_base = getApiBase();

export const Login_api = async (username, password) => {
  try {
    const response = await axios.post(api_base + "/ClientLogInDet", {
      Username: username,
      Password: password,
      // headers: {
      //   'Authorization': `Bearer ${localStorage.getItem("token")}`
      // }
    });
    return response;
  } catch (error) {
    return error.response;
  }
};

export const forgot_pass = async (mail) => {
  try {
    const response = await axios.post(
      api_base + "/ClientForgotPassword/ClientForgetPasswordOTPData",
      {
        Username: encryption(mail),
      }
    );

    return response;
  } catch (error) {
    return error;
  }
};

export const otp_api = async (otp, Username) => {
  try {
    const response = await axios.post(
      api_base + "/ClientForgotPassword/ClientforgetpasswordOTPCheck",
      {
        OTP: otp,
        Username: encryption(Username),
      }
    );

    return response;
  } catch (error) {
    return error;
  }
};

export const reset_pass = async (OTP, Username, password) => {
  try {
    const response = await axios.patch(
      api_base + "/ClientForgotPassword/ClientpasswordUpdate",
      {
        OTP: OTP,
        Username: encryption(Username),
        Password: encryption(password),
      }
    );

    return response;
  } catch (error) {
    return error;
  }
};

export const Designation_entry = async (data) => {
  try {
    const response = await axios.post(
      api_base + "/ClientDesignation",
      {
        DesignationName: data.designation,
        DesignationSName: data.shortName,
        Description: data.description,
        IsActive: data.active,
        AddedBy: "John Doe",
      },
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    return response;
  } catch (error) {
    return error.response;
  }
};
export const Designation_get = async () => {
  try {
    const response = await axios.get(
      `${api_base}/ClientDesignation/GetDesignationDatas`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export const Designation_Dropdown = async () => {
  try {
    const response = await axios.get(
      `${api_base}/ClientDesignation/GetDesignationDropdown`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export const ExportDesignation_api = async () => {
  try {
    const response = await axios.get(
      `${api_base}/ClientDesignation/DesignationExcelFileDownload`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export const Designation_entry_get = async (data) => {
  try {
    const response = await axios.get(
      `${api_base}/ClientDesignation/GetDesignationColumnChoose`,
      {
        params: {
          filter: data.filter,
          page: data.page,
          limit: data.limit,
        },
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    return response; // Assuming you are interested in the response data
  } catch (error) {
    return error.response;
  }
};

export const Designation_get_by_id = async (id) => {
  try {
    const response = await axios.get(
      `${api_base}/ClientDesignation/GetDesignationData/${id}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    return response; // Assuming you are interested in the response data
  } catch (error) {
    return error.response;
  }
};

export const ImportDesignation_api = async (FileName) => {
  try {
    const response = await axios.post(
      `${api_base}ClientDesignation/DesignationExcelFileImport`,
      { FileName: FileName }, // Move params to the data object
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    return response; // Assuming you are interested in the response data
  } catch (error) {
    return error.response;
  }
};
export const ImportDesignation_api_final = async (FileName) => {
  try {
    const response = await axios.post(
      api_base + `ClientDesignation/DesignationExcelFileImportFinal`,
      { FileName: FileName }, // Move params to the data object
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    return response; // Assuming you are interested in the response data
  } catch (error) {
    return error.response;
  }
};

export const DeleteDesignation_by_id = async (id) => {
  try {
    const response = await axios.delete(
      api_base + `/ClientDesignation/deleteDesignationData/${id}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    return response; // Assuming you are interested in the response data
  } catch (error) {
    return error.response;
  }
};

export const DesignationConfigurationSave = async (data) => {
  try {
    const response = await axios.put(
      api_base + `/ClientDesignation/UpdateDesignationConfiguration`,
      data,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    return response; // Assuming you are interested in the response data
  } catch (error) {
    return error.response;
  }
};

export const Designation_edit = async (id, data) => {
  try {
    const response = await axios.patch(
      api_base + `/ClientDesignation/UpdateDesignationData/${id}`,
      {
        DesignationName: data.designation,
        DesignationSName: data.shortName,
        Description: data.description,
        IsActive: data.active,
        AddedBy: "John Doe",
      },
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export const Department_entry = async (data) => {
  try {
    const response = await axios.post(
      api_base + "/ClientDepartment",
      {
        DepartmentName: data.department,
        DepartmentSName: data.shortName,
        Description: data.description,
        IsActive: data.active,
        AddedBy: "John Doe",
        LastModifiedBy: "John Doe",
      },
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    return response;
  } catch (error) {
    return error.response;
  }
};
export const Department_get = async () => {
  try {
    const response = await axios.get(
      api_base + "/ClientDepartment/GetDepartmentDatas",
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export const Department_Dropdown = async () => {
  try {
    const response = await axios.get(
      `${api_base}/ClientDepartment/GetDepartmentDropdown`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export const Department_export_api = async () => {
  try {
    const response = await axios.get(
      `${api_base}/ClientDepartment/DepartmentExcelFileDownload`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    return response;
  } catch (error) {
    return error.response;
  }
};
export const Department_entry_get = async (data) => {
  try {
    const response = await axios.get(
      api_base + "/ClientDepartment/GetDepartmentColumnChoose",
      {
        params: {
          filter: data.filter,
          page: data.page,
          limit: data.limit,
        },
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    return response;
  } catch (error) {
    return error.response;
  }
};
export const Department_entry_get_by_id = async (id) => {
  try {
    const response = await axios.get(
      api_base + `/ClientDepartment/GetDepartmentData/${id}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export const Department_edit = async (id, data) => {
  try {
    const response = await axios.patch(
      api_base + `/ClientDepartment/UpdateDepartmentData/${id}`,
      {
        DepartmentName: data.department,
        DepartmentSName: data.shortName,
        DepartmentID: id,
        Description: data.description,
        IsActive: data.active,
        AddedBy: "John Doe",
        LastModifiedBy: "John Doe",
      },
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export const DeleteDepartment_by_id = async (id) => {
  try {
    const response = await axios.delete(
      api_base + `/ClientDepartment/deleteDepartmentData/${id}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    return response; // Assuming you are interested in the response data
  } catch (error) {
    return error.response;
  }
};
export const Department_configuration_update = async (data) => {
  try {
    const response = await axios.put(
      `${api_base}/ClientDepartment/UpdateDepartmentConfiguration`,
      data,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    return response; // Assuming you are interested in the response data
  } catch (error) {
    return error;
  }
};
export const ImportDepartment_api = async (FileName) => {
  try {
    const response = await axios.post(
      `${api_base}ClientDepartment/DepartmentExcelFileImport`,
      { FileName: FileName }, // Move params to the data object
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );

    return response; // Assuming you are interested in the response data
  } catch (error) {
    return error.response;
  }
};
export const ImportDepartment_api_final = async (FileName) => {
  try {
    const response = await axios.post(
      `${api_base}ClientDepartment/DepartmentExcelFileImportFinal`,
      { FileName: FileName }, // Move params to the data object
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    return response; // Assuming you are interested in the response data
  } catch (error) {
    return error.response;
  }
};

export const User_entry_api = async (data) => {
  try {
    const response = await axios.post(
      api_base + "/ClientUsersAccess",
      {
        Username: data.Username,
        Password: encryption(data.Password),
        FirstName: data.Firstname,
        LastName: data.Lastname,
        MobileNumber1: data.Mobilenumber1,
        MobileNumber2: data.Mobilenumber2,
        EmailID: encryption(data.Emailid),
        HomeAddress: data.Homeaddress,
        DesignationID: Number(data.DesignationID),
        DepartmentID: Number(data.DepartmentID),
        IsTL: data.Role,
        Remarks: data.Remarks,
        AddedBy: "john",
        LastModifiedBy: "john",
        UserAccessData: data.UserAccessData,
        IsActive: data.Active,
      },
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );

    return response;
  } catch (error) {
    return error.response;
  }
};

export const User_get = async (data) => {
  try {
    const response = await axios.get(
      api_base + "/ClientUsersAccess/GetClientUsersColumnChoose",
      {
        params: {
          filter: data.filter,
          page: data.page,
          limit: data.limit,
        },
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export const User_get_by_id = async (id) => {
  try {
    const response = await axios.get(
      api_base + `/ClientUsersAccess/GetClientUsersAccessData/${id}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );

    return response;
  } catch (error) {
    return error.response;
  }
};

export const User_configuration_update = async (data) => {
  try {
    const response = await axios.put(
      `${api_base}/ClientUsersAccess/UpdateClientAccessConfiguration`,
      data,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    return response; // Assuming you are interested in the response data
  } catch (error) {
    return error;
  }
};
export const Delete_User_by_id = async (id) => {
  try {
    const response = await axios.delete(
      `${api_base}/ClientUsersAccess/deleteClientUsersAccess/${id}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    return response; // Assuming you are interested in the response data
  } catch (error) {
    return error.response;
  }
};
export const User_edit = async (id, data) => {
  try {
    const response = await axios.patch(
      api_base + `/ClientUsersAccess/UpdateClientUsersAccess/${id}`,
      {
        Username: data.Username,
        Password: data.Password ? encryption(data.Password) : "",
        FirstName: data.Firstname,
        LastName: data.Lastname,
        MobileNumber1: data.Mobilenumber1,
        MobileNumber2: data.Mobilenumber2,
        EmailID: encryption(data.Emailid),
        HomeAddress: data.Homeaddress,
        DesignationID: data.DesignationID,
        DepartmentID: data.DepartmentID,
        IsTL: data.Role,
        Remarks: data.Remarks,
        AddedBy: "john",
        LastModifiedBy: "john",
        UserAccessData: data.UserAccessData,
        IsActive: data.Active,
      },
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );

    return response;
  } catch (error) {
    return error.response;
  }
};

export const get_Client_User_Pages = async () => {
  try {
    const response = await axios.get(
      `${api_base}/ClientUsersAccess/GetClientUserPages`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );

    return response;
  } catch (error) {
    return error.response;
  }
};

export const get_Client_Page_Access = async (page) => {
  try {
    const response = await axios.post(
      `${api_base}/ClientUsersAccess/ClientPageAccess`,
      {
        PageID: page,
      },
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );

    return response;
  } catch (error) {
    return error.response;
  }
};

export const City_get = async (StateID) => {
  try {
    const response = await axios.get(
      `${api_base}/ClientC/GetCityByStateID/${StateID}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );

    return response;
  } catch (error) {
    return error.response;
  }
};
export const State_get = async () => {
  try {
    const response = await axios.get(
      `${api_base}/ClientC/GetStateByCountryID/1`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    //
    return response;
  } catch (error) {
    return error.response;
  }
};

export const ImportUser_api = async (FileName) => {
  try {
    const response = await axios.post(
      `${api_base}ClientUsersAccess/UsersExcelFileImport`,
      { FileName: FileName }, // Move params to the data object
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    return response; // Assuming you are interested in the response data
  } catch (error) {
    return error.response;
  }
};
export const ImportUser_api_final = async (FileName) => {
  try {
    const response = await axios.post(
      `${api_base}ClientUsersAccess/UsersExcelFileImportFinal`,
      { FileName: FileName }, // Move params to the data object
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    return response; // Assuming you are interested in the response data
  } catch (error) {
    return error.response;
  }
};

export const ExportUser_api = async () => {
  try {
    const response = await axios.get(
      `${api_base}/ClientUsersAccess/UsersExcelFileDownload`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export const ImportFileFormatUser_api = async (FileName) => {
  try {
    const response = await axios.get(
      `${api_base}/ClientUsersAccess/UsersExcelFileDownloadDemo`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    return response; // Assuming you are interested in the response data
  } catch (error) {
    return error.response;
  }
};

// Employee Entry API

export const Employee_entry_api = async (data) => {
  console.log(data);
  try {
    const response = await axios.post(
      api_base + "/ClientEmployee",
      {
        EmployeeName: data.EmployeeName,
        Gender: Number(data.Gender),
        IsMarried: data.IsMarried,
        DOB: data.DOB,
        DOJ: data.DOJ,
        DOA: data.DOA,
        MobileNo1: data.MobileNo1,
        MobileNo2: data.MobileNo2,
        EmailID: data.EmailID,
        Image: data.Image,

        RelationID: Number(data.RelationID),
        EmployeeRelationName: data.EmployeeRelationName,
        EmployeeRelationMobileNo: data.EmployeeRelationMobileNo,
        EmployeeRelationEmailID: data.EmployeeRelationEmailID,
        EmployeeRelationDOB: data.EmployeeRelationDOB,
        EmployeeRelationAadharCardNo: data.EmployeeRelationAadharCardNo,

        EmloyeeEmergencyContactRelationID: Number(
          data.EmloyeeEmergencyContactRelationID
        ),
        EmloyeeEmergencyContactName: data.EmloyeeEmergencyContactName,
        EmloyeeEmergencyContactMobileNumber:
          data.EmloyeeEmergencyContactMobileNumber,

        AadharCardNo: data.AadharCardNo,
        PAN: data.PAN,
        UAN: data.UAN,
        IsPT: data.IsPT,
        PTNo: data.PTNo,
        IsESIC: data.IsESIC,
        ESICNo: data.ESICNo,
        IsEPF: data.IsEPF,
        EPFNo: data.EPFNo,

        DocumentTypeID: data.DocumentTypeID,
        DocumentName: data.DocumentName,
        DocumentFilePath: data.DocumentFilePath,

        BankName: data.BankName,
        BranchName: data.BranchName,
        IFSCode: data.IFSCode,
        AccountName: data.AccountName,
        AccountNo: data.AccountNo,
        IsActive: data.IsActive,
      },
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export const Employee_get = async (data) => {
  try {
    const response = await axios.get(
      api_base + "/ClientEmployee/GetClientEmployeeColumnChoose",
      {
        params: {
          filter: data.filter,
          page: data.page,
          limit: data.limit,
        },
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export const Employee_configuration_update = async (data) => {
  try {
    const response = await axios.put(
      `${api_base}/ClientEmployee/UpdateClientEmployeeConfiguration`,
      data,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    return response; // Assuming you are interested in the response data
  } catch (error) {
    return error;
  }
};

export const Employee_edit = async (id, data) => {
  try {
    const response = await axios.patch(
      api_base + `/ClientEmployee/UpdateEmployee/${id}`,
      {
        EmployeeName: data.EmployeeName,
        Gender: Number(data.Gender),
        IsMarried: data.IsMarried,
        DOB: data.DOB,
        DOJ: data.DOJ,
        DOA: data.DOA,
        MobileNo1: data.MobileNo1,
        MobileNo2: data.MobileNo2,
        EmailID: data.EmailID,
        Image: data.Image,

        RelationID: Number(data.RelationID),
        EmployeeRelationName: data.EmployeeRelationName,
        EmployeeRelationMobileNo: data.EmployeeRelationMobileNo,
        EmployeeRelationEmailID: data.EmployeeRelationEmailID,
        EmployeeRelationDOB: data.EmployeeRelationDOB,
        EmployeeRelationAadharCardNo: data.EmployeeRelationAadharCardNo,

        EmloyeeEmergencyContactRelationID: Number(
          data.EmloyeeEmergencyContactRelationID
        ),
        EmloyeeEmergencyContactName: data.EmloyeeEmergencyContactName,
        EmloyeeEmergencyContactMobileNumber:
          data.EmloyeeEmergencyContactMobileNumber,

        AadharCardNo: data.AadharCardNo,
        PAN: data.PAN,
        UAN: data.UAN,
        IsPT: data.IsPT,
        PTNo: data.PTNo,
        IsESIC: data.IsESIC,
        ESICNo: data.ESICNo,
        IsEPF: data.IsEPF,
        EPFNo: data.EPFNo,

        DocumentTypeID: data.DocumentTypeID,
        DocumentName: data.DocumentName,
        DocumentFilePath: data.DocumentFilePath,

        BankName: data.BankName,
        BranchName: data.BranchName,
        IFSCode: data.IFSCode,
        AccountName: data.AccountName,
        AccountNo: data.AccountNo,
        IsActive: data.IsActive,
      },
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export const Employee_get_by_id = async (id) => {
  try {
    const response = await axios.get(
      api_base + `/ClientEmployee/GetClientEmployeeData/${id}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export const upload_Employee_file = async (FileName) => {
  try {
    const response = await axios.post(
      `${api_base}/UploadFile/Upload`,
      {
        FileName: FileName,
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export const Delete_Employee_by_id = async (id) => {
  try {
    const response = await axios.delete(
      `${api_base}/ClientEmployee/DeleteClientEmployee/${id}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    return response; // Assuming you are interested in the response data
  } catch (error) {
    return error.response;
  }
};

export const EmployeeRelation_Dropdown = async () => {
  try {
    const response = await axios.get(
      `${api_base}/ClientEmployee/ClientEmployeeRelationDropdown`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

//Client Location
export const Add_Client_Location = async (id, data) => {
  try {
    const response = await axios.patch(
      api_base + `ClientC/AddClientLocationData/${id}`,
      {
        LocationName: data.LocationName,
        AddLine1: data.AddLine1,
        AddLine2: data.AddLine2,
        CityID: data.CityID,
        StateID: data.StateID,
        Pincode: data.Pincode,
        PAN: data.PAN,
        IsGSTApplicable: data.IsGSTApplicable,
        GSTIN: data.GSTIN,

        IsPFApplicable: data.IsPFApplicable,
        IsPFDuplicate: data.IsPFDuplicate,
        PFNumber: data.PFNumber,
        PFPassword: encryption(data.PFPassword),
        PFMobileNo: data.PFMobileNo,
        PFUsername: data.PFUsername,
        PFEmailID: encryption(data.PFEmailID),

        IsESICApplicable: data.IsESICApplicable,
        IsESICDuplicate: data.IsESICDuplicate,
        ESICNumber: data.ESICNumber,
        ESICPassword: encryption(data.ESICPassword),
        ESICMobileNo: data.ESICMobileNo,
        ESICUsername: data.ESICUsername,
        ESICEmailID: encryption(data.ESICEmailID),

        IsPTApplicable: data.IsPTApplicable,
        IsPTDuplicate: data.IsPTDuplicate,
        PTNumber: data.PTNumber,
        PTEmployerNo: data.PTEmployerNo,
        PTEmployeeNo: data.PTEmployeeNo,

        IsFactoryLicenseApplicable: data.IsFactoryLicenseApplicable,
        IsFactoryDuplicate: data.IsFactoryDuplicate,
        FactoryLicenseNo: data.FactoryLicenseNo,
        EndDate: data.EndDate,
        StartDate: data.StartDate,
      },
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );

    return response;
  } catch (error) {
    return error;
  }
};

export const ClientLocation_edit = async (ClientID, id, data) => {
  try {
    console.log(data);
    const response = await axios.patch(
      api_base + `/ClientC/UpdateClientLocByLocationID/${ClientID}/${id}`,
      {
        LocationName: data.LocationName,
        AddLine1: data.AddLine1,
        AddLine2: data.AddLine2,
        CityID: data.CityID,
        StateID: data.StateID,
        Pincode: data.Pincode,
        PAN: data.PAN,
        IsGSTApplicable: data.IsGSTApplicable,
        GSTIN: data.GSTIN,

        IsPFApplicable: data.IsPFApplicable,
        IsPFDuplicate: data.IsPFDuplicate,
        PFNumber: data.PFNumber,
        PFPassword: encryption(data.PFPassword),
        PFMobileNo: data.PFMobileNo,
        PFUsername: data.PFUsername,
        PFEmailID: encryption(data.PFEmailID),

        IsESICApplicable: data.IsESICApplicable,
        IsESICDuplicate: data.IsESICDuplicate,
        ESICNumber: data.ESICNumber,
        ESICPassword: encryption(data.ESICPassword),
        ESICMobileNo: data.ESICMobileNo,
        ESICUsername: data.ESICUsername,
        ESICEmailID: encryption(data.ESICEmailID),

        IsPTApplicable: data.IsPTApplicable,
        IsPTDuplicate: data.IsPTDuplicate,
        PTNumber: data.PTNumber,
        PTEmployerNo: data.PTEmployerNo,
        PTEmployeeNo: data.PTEmployeeNo,

        IsFactoryLicenseApplicable: data.IsFactoryLicenseApplicable,
        IsFactoryDuplicate: data.IsFactoryDuplicate,
        FactoryLicenseNo: data.FactoryLicenseNo,
        EndDate: data.EndDate,
        StartDate: data.StartDate,
      },
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );

    return response;
  } catch (error) {
    return error;
  }
};

export const ClientLocation_get_by_id = async (id) => {
  try {
    const response = await axios.get(
      api_base + `/ClientC/GetLocationByLocationID/${id}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );

    return response;
  } catch (error) {
    return error.response;
  }
};

export const Client_Location_get = async (id) => {
  try {
    const response = await axios.get(
      `${api_base}/ClientC/GetLocationByClientID/${id}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export const DeleteLocation_by_id = async (id) => {
  try {
    const response = await axios.delete(
      api_base + `/ClientC/DeleteClientLocationData/${id}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export const CheckBoxDuplicateRecord = async (data) => {
  try {
    const response = await axios.post(
      `${api_base}/Generic/ClientDuplicateDataCheck`,
      {
        table: data.table,
        name: data.name,
        id: data.id,
      },
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    return response; // Assuming you are interested in the response data
  } catch (error) {
    return error.response;
  }
};

export const UploadFile_api = async (FileName) => {
  try {
    const response = await axios.post(
      `${api_base}/Upload/ClientFileUpload`,
      {
        FileName: FileName,
      },
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response; // Assuming you are interested in the response data
  } catch (error) {
    return error.response;
  }
};

export const CheckMailDuplicateRecord = async (data) => {
  try {
    const response = await axios.post(
      `${api_base}/GenericMail/ClientDuplicateMailCheck`,
      {
        useremail: data.useremail,
        id: data.id,
      },
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    return error.response;
  }
};

//Salary Component

export const SalaryComponent_entry_get = async (data) => {
  try {
    const response = await axios.get(
      `${api_base}/ClientSalaryComponents/GetSalaryComponentsColumnChoose`,
      {
        params: {
          filter: data.filter,
          page: data.page,
          limit: data.limit,
        },
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    return response; // Assuming you are interested in the response data
  } catch (error) {
    return error.response;
  }
};

export const SalaryComponentConfigurationSave = async (data) => {
  try {
    const response = await axios.put(
      api_base + `/ClientSalaryComponents/UpdateSalaryComponentsConfiguration`,
      data,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    return response; // Assuming you are interested in the response data
  } catch (error) {
    return error.response;
  }
};

export const DeleteSalaryComponent_by_id = async (id) => {
  try {
    const response = await axios.delete(
      api_base + `/ClientSalaryComponents/deleteSalaryComponentsData/${id}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export const SalaryComponent_entry = async (data) => {
  try {
    const response = await axios.post(
      api_base + "/ClientSalaryComponents",
      {
        ParentComponentID: data.ParentComponentID,
        ComponentName: data.ComponentName,
        ComponentShortName: data.ComponentShortName,
        ComponentDisplayName: data.ComponentDisplayName,
        ComponentDisplayShortName: data.ComponentDisplayShortName,
        AddedBy: "John Doe",
      },
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export const SalaryComponent_edit = async (id, data) => {
  try {
    const response = await axios.patch(
      api_base + `/ClientSalaryComponents/UpdateSalaryComponentsData/${id}`,
      {
        ParentComponentID: data.ParentComponentID,
        ComponentName: data.ComponentName,
        ComponentShortName: data.ComponentShortName,
        ComponentDisplayName: data.ComponentDisplayName,
        ComponentDisplayShortName: data.ComponentDisplayShortName,
        AddedBy: "John Doe",
      },
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export const SalaryComponent_Dropdown = async () => {
  try {
    const response = await axios.get(
      `${api_base}/ClientSalaryComponents/GetSalaryComponentsDropdown`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export const SalaryComponent_get_by_id = async (id) => {
  try {
    const response = await axios.get(
      `${api_base}/ClientSalaryComponents/GetSalaryComponentsByID/${id}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    return response; // Assuming you are interested in the response data
  } catch (error) {
    return error.response;
  }
};

//Professional Tax
export const PT_entry = async (data) => {
  try {
    const response = await axios.post(
      api_base + "/ClientProfessionalTax",
      {
        DeductionName: data.DeductionName,
        StateID: data.StateID,
        DeductionShortName: data.DeductionShortName,
        DeductionDisplayName: data.DeductionDisplayName,
        StartDate: data.StartDate,
        EndDate: data.EndDate,
        StartRange: data.StartRange,
        EndRange: data.EndRange,
        IsPercentage: data.IsPercentage,
        Amount: data.Amount,
        Month: data.Month,
      },
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export const ProfessionalTax_get = async (data) => {
  try {
    const response = await axios.get(
      `${api_base}/ClientProfessionalTax/GetProfessionalTaxColumnChoose`,
      {
        params: {
          filter: data.filter,
          page: data.page,
          limit: data.limit,
        },
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    return response; // Assuming you are interested in the response data
  } catch (error) {
    return error.response;
  }
};

export const PT_configuration_update = async (data) => {
  try {
    const response = await axios.put(
      `${api_base}/ClientProfessionalTax/UpdateProfessionalTaxConfiguration`,
      data,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    return response; // Assuming you are interested in the response data
  } catch (error) {
    return error;
  }
};

export const PT_get_by_id = async (id) => {
  try {
    const response = await axios.get(
      `${api_base}/ClientProfessionalTax/GetProfessionalTaxData/${id}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    return response; // Assuming you are interested in the response data
  } catch (error) {
    return error.response;
  }
};

export const PT_CheckRange = async (data) => {
  try {
    const response = await axios.post(
      api_base + "/ClientProfessionalTax/ProfessionalTaxCheckRange",
      {
        StartDate: data.StartDate,
        EndDate: data.EndDate,
        StateID: data.StateID,
      },
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

//Salary Structure

export const SalaryStructure_entry = async (data) => {
  try {
    const response = await axios.post(
      api_base + "/ClientSalaryStructure",
      {
        StartRange: Number(data.StartRange),
        EndRange: Number(data.EndRange),
        SalaryStructute: data.SalaryStructute,
        IsActive: true,
        SalaryStructureSName: data.SalaryStructureSName,
        SalaryStructureName: data.SalaryStructureName,

        SalaryType: Number(data.SalaryType),
      },
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export const SalaryStructure_get_by_id = async (id) => {
  try {
    const response = await axios.get(
      `${api_base}/ClientSalaryStructure/GetSalaryStructureData/${id}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    return response; // Assuming you are interested in the response data
  } catch (error) {
    return error.response;
  }
};

export const SalaryStructure_edit = async (id, data) => {
  try {
    const response = await axios.patch(
      api_base + `/ClientSalaryStructure/UpdateSalaryStructureData/${id}`,
      {
        StartRange: Number(data.StartRange),
        EndRange: Number(data.EndRange),
        SalaryStructute: data.SalaryStructute,
        IsActive: true,
        SalaryType: Number(data.SalaryType),
      },
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export const SalaryStructure_get = async (data) => {
  try {
    const response = await axios.get(
      `${api_base}/ClientSalaryStructure/GetSalarySrtructureColumnChoose`,
      {
        params: {
          filter: data.filter,
          page: data.page,
          limit: data.limit,
        },
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    return response; // Assuming you are interested in the response data
  } catch (error) {
    return error.response;
  }
};

export const DeleteSalaryStructure_by_id = async (id) => {
  try {
    const response = await axios.delete(
      api_base + `/ClientSalaryStructure/DeleteSalaryStructureData/${id}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export const SalaryStructureConfigurationSave = async (data) => {
  try {
    const response = await axios.put(
      api_base + `/ClientSalaryStructure/UpdateSalaryStructureConfiguration`,
      data,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    return response; // Assuming you are interested in the response data
  } catch (error) {
    return error.response;
  }
};

export const SalaryStructure_Dropdown = async () => {
  try {
    const response = await axios.get(
      `${api_base}/ClientSalaryStructure/GetSalaryComponentDropdown`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    return response;
  } catch (error) {
    return error.response;
  }
};
