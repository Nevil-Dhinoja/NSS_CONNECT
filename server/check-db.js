const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'nss-charusat',
});

async function checkAndCreateTables() {
    try {
        // Check if event_reports table exists
        const checkEventReports = await db.promise().query(`
            SELECT COUNT(*) as count 
            FROM information_schema.tables 
            WHERE table_schema = '${process.env.DB_NAME || 'nss-charusat'}' 
            AND table_name = 'event_reports'
        `);
        
        if (checkEventReports[0][0].count === 0) {
            await db.promise().query(`
                CREATE TABLE event_reports (
                    id int(11) NOT NULL AUTO_INCREMENT,
                    event_id int(11) NOT NULL,
                    file_path varchar(500) NOT NULL,
                    submitted_by varchar(255) NOT NULL,
                    submitted_by_id int(11) NOT NULL,
                    status enum('pending','approved','rejected') DEFAULT 'pending',
                    comments text DEFAULT 'No Comments',
                    approved_by int(11) DEFAULT NULL,
                    approved_at timestamp NULL DEFAULT NULL,
                    created_at timestamp NOT NULL DEFAULT current_timestamp(),
                    updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
                    PRIMARY KEY (id),
                    KEY event_id (event_id),
                    KEY submitted_by_id (submitted_by_id),
                    KEY status (status),
                    KEY approved_by (approved_by)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
            `);
        }

        // Check if events table exists
        const checkEvents = await db.promise().query(`
            SELECT COUNT(*) as count 
            FROM information_schema.tables 
            WHERE table_schema = '${process.env.DB_NAME || 'nss-charusat'}' 
            AND table_name = 'events'
        `);
        
        if (checkEvents[0][0].count === 0) {
            await db.promise().query(`
                CREATE TABLE events (
                    id int(11) NOT NULL AUTO_INCREMENT,
                    event_name varchar(255) NOT NULL,
                    event_date date NOT NULL,
                    event_mode enum('online','offline','hybrid') DEFAULT 'offline',
                    description text DEFAULT NULL,
                    status enum('upcoming','completed') DEFAULT 'upcoming',
                    department_id int(11) DEFAULT NULL,
                    created_by int(11) DEFAULT NULL,
                    created_at timestamp NOT NULL DEFAULT current_timestamp(),
                    updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
                    PRIMARY KEY (id),
                    KEY department_id (department_id),
                    KEY created_by (created_by)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
            `);
        }

        // Check if pc_events table exists
        const checkPcEvents = await db.promise().query(`
            SELECT COUNT(*) as count 
            FROM information_schema.tables 
            WHERE table_schema = '${process.env.DB_NAME || 'nss-charusat'}' 
            AND table_name = 'pc_events'
        `);
        
        if (checkPcEvents[0][0].count === 0) {
            await db.promise().query(`
                CREATE TABLE pc_events (
                    id int(11) NOT NULL AUTO_INCREMENT,
                    event_name varchar(255) NOT NULL,
                    event_date date NOT NULL,
                    event_mode enum('online','offline','hybrid') DEFAULT 'offline',
                    description text DEFAULT NULL,
                    status enum('upcoming','completed') DEFAULT 'upcoming',
                    created_by int(11) DEFAULT NULL,
                    created_at timestamp NOT NULL DEFAULT current_timestamp(),
                    updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
                    PRIMARY KEY (id),
                    KEY created_by (created_by)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
            `);
        }

        // Check if working_hours table exists
        const checkWorkingHours = await db.promise().query(`
            SELECT COUNT(*) as count 
            FROM information_schema.tables 
            WHERE table_schema = '${process.env.DB_NAME || 'nss-charusat'}' 
            AND table_name = 'working_hours'
        `);
        
        if (checkWorkingHours[0][0].count === 0) {
            await db.promise().query(`
                CREATE TABLE working_hours (
                    id int(11) NOT NULL AUTO_INCREMENT,
                    login_id varchar(50) NOT NULL,
                    activity_name varchar(255) NOT NULL,
                    date date NOT NULL,
                    start_time time NOT NULL,
                    end_time time NOT NULL,
                    hours decimal(4,2) NOT NULL,
                    status enum('pending','approved','rejected') DEFAULT 'pending',
                    description text DEFAULT NULL,
                    created_at timestamp NOT NULL DEFAULT current_timestamp(),
                    updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
                    PRIMARY KEY (id),
                    KEY login_id (login_id),
                    KEY status (status)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
            `);
        }
        
    } catch (error) {
        console.error('Error checking/creating tables:', error);
    } finally {
        db.end();
    }
}

checkAndCreateTables(); 