const connection = require("../config/connection");

class DB {
  // Keeping a reference to the connection on the class in case we need it later
  constructor(connection) {
    this.connection = connection;
  }

  // Find all employees, join with roles and departments to display their roles, salaries, departments, and managers
  findAllEmployees() {
    return this.connection.query(
      'SELECT e.id, e.first_name, e.last_name, role.title, d.name AS department, role.salary, CONCAT_WS(" ", manager.first_name, manager.last_name) AS manager FROM employee AS e \
      LEFT JOIN role ON e.role_id = role.id \
      LEFT JOIN department AS d ON role.department_id = d.id \
      LEFT JOIN employee manager ON manager.id = e.manager_id'
    );
  }

  // Find all employees except the given employee id
  findAllPossibleManagers(employeeId) {
    return this.connection.query(
      "SELECT id, first_name, last_name FROM employee WHERE id != ?",
      employeeId
    );
  }

  // Create a new employee
  createEmployee(employee) {
    return this.connection.query("INSERT INTO employee SET ?", employee);
  }


  // Update the given employee's role
  updateEmployeeRole(employeeId, roleId) {
    return this.connection.query(
      'UPDATE employee SET role_id = ? WHERE id = ?',
      [roleId, employeeId]
    );
  }

  // Update the given employee's manager
  updateEmployeeManager(employeeId, managerId) {
    return this.connection.query(
      "UPDATE employee SET manager_id = ? WHERE id = ?",
      [managerId, employeeId]
    );
  }

  // Find all roles, join with departments to display the department name
  findAllRoles() {
    return this.connection.query(
      'SELECT r.id, r.title, r.salary, d.name FROM role AS r LEFT JOIN department AS d ON r.department_id = d.id'
    );
  }

  // Create a new role
  createRole(role) {
    return this.connection.query('INSERT INTO role SET ?', role);
  }

  // Find all departments, join with employees and roles and sum up utilized department budget
  findAllDepartments() {
    return this.connection.query(
      "SELECT department.id, department.name, SUM(role.salary) AS utilized_budget \
      FROM department LEFT JOIN role ON role.department_id = department.id \
      LEFT JOIN employee ON employee.role_id = role.id \
      GROUP BY department.id, department.name"
    );
  }

  // Create a new department
  createDepartment(department) {
    return this.connection.query('INSERT INTO department SET ?', department);
  }

  // Find all employees in a given department, join with roles to display role titles
  findAllEmployeesByDepartment(departmentId) {
    return this.connection.query(
      "SELECT employee.id, employee.first_name, employee.last_name, role.title \
      FROM employee \
      LEFT JOIN role on employee.role_id = role.id \
      LEFT JOIN department department on role.department_id = department.id \
      WHERE department.id = ?;",
      departmentId
    );
  }

  // Find all employees by manager, join with departments and roles to display titles and department names
  findAllEmployeesByManager(managerId) {
    return this.connection.query(
      'SELECT CONCAT_WS(" ", e.first_name, e.last_name) AS manager, role.title, d.name AS department FROM employee AS e LEFT JOIN role ON e.id = role.id LEFT JOIN department AS d ON e.id = d.id WHERE e.manager_id = ?', managerId
    );
  }
}

module.exports = new DB(connection);
