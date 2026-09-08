create table if not exists staff_users (
  id            int auto_increment primary key,
  name          varchar(255) not null,
  email         varchar(255) not null unique,
  password_hash varchar(255) not null,
  created_at    timestamp    not null default current_timestamp
);

create table if not exists bookings (
  id             int auto_increment primary key,

  city           varchar(255) not null,
  street_address varchar(255) not null,
  lawn_size      enum('small', 'medium', 'large', 'extra_large') not null,

  full_name      varchar(255) not null,
  email          varchar(255) not null,
  phone          varchar(255) not null,

  service_date   date not null,
  time_slot      enum('morning', 'afternoon', 'full_day') not null,

  status         enum('pending', 'confirmed', 'completed', 'cancelled') not null default 'pending',
  note           text,

  created_at     timestamp not null default current_timestamp,
  updated_at     timestamp not null default current_timestamp on update current_timestamp,

  index bookings_status_idx (status),
  index bookings_service_date_idx (service_date)
);
