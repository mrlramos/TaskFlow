const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const AuditLog = sequelize.define('AuditLog', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    taskId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'task_id',
      references: {
        model: 'tasks',
        key: 'id'
      }
    },
    action: {
      type: DataTypes.ENUM('CREATE', 'UPDATE', 'DELETE'),
      allowNull: false,
      validate: {
        isIn: {
          args: [['CREATE', 'UPDATE', 'DELETE']],
          msg: 'Action must be CREATE, UPDATE, or DELETE'
        }
      }
    },
    oldData: {
      type: DataTypes.JSON,
      allowNull: true,
      field: 'old_data'
    },
    newData: {
      type: DataTypes.JSON,
      allowNull: true,
      field: 'new_data'
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'user_id',
      comment: 'Future feature: user identification'
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'audit_logs',
    underscored: true,
    timestamps: false // We manage timestamp manually
  });

  // Define associations
  AuditLog.associate = (models) => {
    AuditLog.belongsTo(models.Task, {
      foreignKey: 'taskId',
      as: 'task'
    });
  };

  return AuditLog;
}; 