import Ticket from "../models/Ticket";
import Client from "../models/Client";
import User from "../models/User";

/**
 * Obtenir début et fin journée
 */
const getDayRange = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

/**
 * Obtenir début et fin mois
 */
const getMonthRange = () => {
  const now = new Date();

  const start = new Date(now.getFullYear(), now.getMonth(), 1);

  const end = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
    999,
  );
  return { start, end };
};

/**
 * Dashboard ADMIN
 */
export const getAdminDashboard = async () => {
  const today = getDayRange();

  const month = getMonthRange();

  /*
  =================================
  Chiffre affaire aujourd'hui
  =================================
  */

  const todaySales = await Ticket.aggregate([
    {
      $match: {
        status: "paid",

        createdAt: {
          $gte: today.start,
          $lte: today.end,
        },
      },
    },

    {
      $group: {
        _id: null,

        revenue: {
          $sum: "$total",
        },

        tickets: {
          $sum: 1,
        },
      },
    },
  ]);

  /*
  =================================
  Chiffre affaire mois
  =================================
  */

  const monthSales = await Ticket.aggregate([
    {
      $match: {
        status: "paid",

        createdAt: {
          $gte: month.start,
          $lte: month.end,
        },
      },
    },

    {
      $group: {
        _id: null,

        revenue: {
          $sum: "$total",
        },

        tickets: {
          $sum: 1,
        },
      },
    },
  ]);

  /*
  =================================
  Clients actifs
  =================================
  */

  const totalClients = await Client.countDocuments({
    isDeleted: false,

    isActive: true,
  });

  /*
  =================================
  Employés actifs
  =================================
  */

  const totalEmployees = await User.countDocuments({
    role: {
      $in: ["employee", "cashier"],
    },

    isActive: true,
  });

  /*
  =================================
  Services populaires
  =================================
  */

  const popularServices = await Ticket.aggregate([
    {
      $match: {
        status: "paid",
      },
    },

    {
      $unwind: "$items",
    },

    {
      $group: {
        _id: "$items.name",

        sales: {
          $sum: 1,
        },

        revenue: {
          $sum: "$items.finalPrice",
        },
      },
    },

    {
      $sort: {
        sales: -1,
      },
    },

    {
      $limit: 5,
    },
  ]);

  /*
  =================================
  Employés performants
  =================================
  */

  const topEmployees = await Ticket.aggregate([
    {
      $match: {
        status: "paid",
      },
    },

    {
      $group: {
        _id: "$employee",

        revenue: {
          $sum: "$total",
        },

        tickets: {
          $sum: 1,
        },
      },
    },

    {
      $sort: {
        revenue: -1,
      },
    },

    {
      $limit: 5,
    },

    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "employee",
      },
    },

    {
      $unwind: "$employee",
    },

    {
      $project: {
        _id: 0,

        employeeId: "$employee._id",

        name: {
          $concat: ["$employee.firstName", " ", "$employee.lastName"],
        },

        revenue: 1,

        tickets: 1,
      },
    },
  ]);

  /*
  =================================
  Retour Dashboard
  =================================
  */

  return {
    salesToday: {
      revenue: todaySales[0]?.revenue || 0,

      tickets: todaySales[0]?.tickets || 0,
    },

    salesMonth: {
      revenue: monthSales[0]?.revenue || 0,

      tickets: monthSales[0]?.tickets || 0,
    },

    clients: {
      total: totalClients,
    },

    employees: {
      total: totalEmployees,
    },

    popularServices,

    topEmployees,
  };
};
/**
 * Dashboard CASHIER
 */
export const getCashierDashboard = async (cashierId: string) => {
  const today = getDayRange();

  const month = getMonthRange();

  /*
=================================
Ventes du jour
=================================
*/

  const todaySales = await Ticket.aggregate([
    {
      $match: {
        status: "paid",

        createdBy: cashierId,

        createdAt: {
          $gte: today.start,
          $lte: today.end,
        },
      },
    },

    {
      $group: {
        _id: null,

        revenue: {
          $sum: "$total",
        },

        tickets: {
          $sum: 1,
        },
      },
    },
  ]);

  /*
=================================
Ventes mois
=================================
*/

  const monthSales = await Ticket.aggregate([
    {
      $match: {
        status: "paid",

        createdBy: cashierId,

        createdAt: {
          $gte: month.start,
          $lte: month.end,
        },
      },
    },

    {
      $group: {
        _id: null,

        revenue: {
          $sum: "$total",
        },

        tickets: {
          $sum: 1,
        },
      },
    },
  ]);

  return {
    salesToday: {
      revenue: todaySales[0]?.revenue || 0,

      tickets: todaySales[0]?.tickets || 0,
    },

    salesMonth: {
      revenue: monthSales[0]?.revenue || 0,

      tickets: monthSales[0]?.tickets || 0,
    },
  };
};

/**
 * Dashboard EMPLOYEE
 */
export const getEmployeeDashboard = async (employeeId: string) => {
  /*
=================================
Tickets réalisés
=================================
*/

  const performance = await Ticket.aggregate([
    {
      $match: {
        status: "paid",

        employee: employeeId,
      },
    },

    {
      $group: {
        _id: null,

        revenue: {
          $sum: "$total",
        },

        tickets: {
          $sum: 1,
        },
      },
    },
  ]);

  /*
=================================
Clients servis
=================================
*/

  const clientsServed = await Ticket.distinct(
    "client",

    {
      employee: employeeId,

      status: "paid",
    },
  );

  /*
=================================
Services réalisés
=================================
*/

  const servicesDone = await Ticket.aggregate([
    {
      $match: {
        employee: employeeId,

        status: "paid",
      },
    },

    {
      $unwind: "$items",
    },

    {
      $group: {
        _id: "$items.name",

        count: {
          $sum: 1,
        },
      },
    },

    {
      $sort: {
        count: -1,
      },
    },
  ]);

  return {
    performance: {
      revenue: performance[0]?.revenue || 0,

      tickets: performance[0]?.tickets || 0,
    },

    clientsServed: clientsServed.length,

    servicesDone,
  };
};
