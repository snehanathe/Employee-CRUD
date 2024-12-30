// Array to store employee data
const employeeData = [];
const usedEmpIDs = new Set();

// Event Listener for Add Button
document.getElementById("addRowButton").addEventListener("click", function () {
    const empID = document.getElementById("empid").value.trim();
    const empName = document.getElementById("empname").value.trim();
    const dob = document.getElementById("dob").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();
    const salary = document.getElementById("salary").value.trim();

    const age = calculateAge(dob);

    // Validate inputs
    if ((!empID) || !empName || !dob || !age || !phone || !address || !salary) {
        document.getElementById("error-message").innerText = "All fields are required!";
        return;
    }

    if (empID <= 0) {
        document.getElementById("error-message").innerText = "EmpID should be greater than 0!";
        return;
    }

    if (usedEmpIDs.has(empID)) {
        document.getElementById("error-message").innerText = "EmpID must be unique!";
        return;
    }

    if (!validateName(empName)) {
        document.getElementById("error-message").innerText = "EmpName should contain only alphabets!";
        return;
    }

    if (phone.length !== 10 || isNaN(phone)) {
        document.getElementById("error-message").innerText = "Phone number must be 10 digits!";
        return;
    }

    if (salary < 5000) {
        document.getElementById("error-message").innerText = "Salary should be greater than 5000!";
        return;
    }

    const newEmployee = {
        empID: empID,
        empName: empName,
        dob: dob,
        age: age,
        phone: phone,
        address: address,
        salary: salary,
    };

    employeeData.push(newEmployee);
    usedEmpIDs.add(empID); // Add empID to used set

    renderTable();

    // Clear input fields
    document.getElementById("empid").value = "";
    document.getElementById("empname").value = "";
    document.getElementById("dob").value = "";
    document.getElementById("age").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("address").value = "";
    document.getElementById("salary").value = "";

    document.getElementById("error-message").innerText = "Record added successfully!";
});

// Function to render the table
function renderTable() {
    const detailsTable = document.getElementById("employeeDetailsTable").getElementsByTagName("tbody")[0];
    detailsTable.innerHTML = ""; // Clear existing rows

    employeeData.forEach((employee) => {
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td>${employee.empID}</td>
            <td>${employee.empName}</td>
            <td>${employee.dob}</td>
            <td>${employee.age}</td>
            <td>${employee.phone}</td>
            <td>${employee.address}</td>
            <td>${employee.salary}</td>
            <td>
                <button onclick="enableUpdate('${employee.empID}')">Update</button>
                <button onclick="deleteEmployee('${employee.empID}')">Delete</button>
                <button onclick="saveRow('${employee.empID}')" style="display: none;">Save</button>
            </td>
        `;
        detailsTable.appendChild(newRow);
    });
}

// Function to enable editing of a row
function enableUpdate(empID) {
    const employee = employeeData.find(emp => emp.empID === empID);
    const rows = document.querySelectorAll("#employeeDetailsTable tbody tr");
    let rowToEdit;

    rows.forEach((row) => {
        const idCell = row.children[0];
        if (idCell.textContent === empID) {
            rowToEdit = row;
        }
    });

    if (rowToEdit) {
        rowToEdit.innerHTML = `
            <td><input type="text" value="${employee.empID}" id="edit-empid"></td>
            <td><input type="text" value="${employee.empName}" id="edit-empname"></td>
            <td><input type="date" value="${employee.dob}" id="edit-dob"></td>
            <td><input type="text" value="${employee.age}" id="edit-age"></td>
            <td><input type="text" value="${employee.phone}" id="edit-phone"></td>
            <td><input type="text" value="${employee.address}" id="edit-address"></td>
            <td><input type="number" value="${employee.salary}" id="edit-salary"></td>
            <td>
                <button onclick="saveRow('${employee.empID}')">Save</button>
                <button onclick="deleteEmployee('${employee.empID}')">Delete</button>
            </td>
        `;
    }
}

// Save edited row
function saveRow(empID) {
    const employee = employeeData.find(emp => emp.empID === empID);
    
    // Fetch updated values from inputs
    const updatedEmpID = document.getElementById("edit-empid").value.trim();
    const updatedEmpName = document.getElementById("edit-empname").value.trim();
    const updatedDob = document.getElementById("edit-dob").value.trim();
    let updatedAge = document.getElementById("edit-age").value.trim();
    const updatedPhone = document.getElementById("edit-phone").value.trim();
    const updatedAddress = document.getElementById("edit-address").value.trim();
    const updatedSalary = document.getElementById("edit-salary").value.trim();

    // Clear any previous error message
    document.getElementById("error-message").innerText = "";

    // Validate updated values
    if (updatedEmpID <= 0) {
        document.getElementById("error-message").innerText = "EmpID should be greater than 0!";
        return;
    }

    if (usedEmpIDs.has(updatedEmpID) && updatedEmpID !== empID) {
        document.getElementById("error-message").innerText = "EmpID must be unique!";
        return;
    } else {
        usedEmpIDs.add(updatedEmpID); // Add updated EmpID to usedEmpIDs set
    }

    if (!updatedEmpID || !updatedEmpName || !updatedDob || !updatedAge || !updatedPhone || !updatedAddress || !updatedSalary) {
        document.getElementById("error-message").innerText = "All fields are required!";
        return;
    }

    if (!validateName(updatedEmpName)) {
        document.getElementById("error-message").innerText = "EmpName shouldn't contain numerical values!";
        return;
    }

    if (updatedPhone.length !== 10 || isNaN(updatedPhone)) {
        document.getElementById("error-message").innerText = "Phone number must be 10 digits!";
        return;
    }

    if (updatedSalary < 5000) {
        document.getElementById("error-message").innerText = "Salary should be greater than 5000!";
        return;
    }

    updatedAge = calculateAge(updatedDob);

    // Update usedEmpIDs set if empID has changed
    if (empID !== updatedEmpID) {
        usedEmpIDs.delete(empID); // Remove old EmpID from usedEmpIDs set
        usedEmpIDs.add(updatedEmpID); // Add new EmpID to set
    }

    // Save updated values
    employee.empID = updatedEmpID;
    employee.empName = updatedEmpName;
    employee.dob = updatedDob;
    employee.age = updatedAge;
    employee.phone = updatedPhone;
    employee.address = updatedAddress;
    employee.salary = updatedSalary;

    renderTable();
    document.getElementById("error-message").innerText = ""; // Clear error message
}

// Delete employee function
function deleteEmployee(empID) {
    const index = employeeData.findIndex(emp => emp.empID === empID);
    if (index !== -1) {
        employeeData.splice(index, 1);
        usedEmpIDs.delete(empID); // Remove empID from used set
        renderTable();
    }
}

// Calculate age based on DOB
document.getElementById('dob').addEventListener('change', () => {
    const dob = document.getElementById('dob').value;
    const age = calculateAge(dob);
    document.getElementById('age').value = age;
});

function validateName(empName) {
    const nameRegex = /^[a-zA-Z ]+$/; // Adjust regex as needed
    return nameRegex.test(empName);
}

function calculateAge(dob) {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    if (
        today.getMonth() < birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
    ) {
        age--;
    }
    return age;
}
