export const up = (pgm) => {

    pgm.createTable('users', {

        id: {
            type: 'uuid',
            primaryKey: true
        },

        name: {
            type: 'varchar(100)',
            notNull: true
        },

        email: {
            type: 'varchar(255)',
            notNull: true,
            unique: true
        },

        password_hash: {
            type: 'varchar(255)',
            notNull: true
        },

        created_at: {
            type: 'timestamptz',
            notNull: true,
            default: pgm.func('current_timestamp')
        },

        updated_at: {
            type: 'timestamptz',
            notNull: true,
            default: pgm.func('current_timestamp')
        }

    });

};

export const down = (pgm) => {

    pgm.dropTable('users');

};