-- Sleeping Beauties
-- MySQL 8.0+
-- Normalized starter database for the Moon archive.
-- First populated artifact: Apollo 11 / Eagle descent stage.

CREATE DATABASE IF NOT EXISTS sleeping_beauties
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sleeping_beauties;

CREATE TABLE celestial_bodies (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(80) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  body_type ENUM('planet','moon','deep_space') NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE missions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(150) NOT NULL,
  program VARCHAR(120),
  launch_date DATE,
  landing_date DATE,
  return_date DATE,
  mission_status ENUM('completed','failed','partial','ongoing','planned') DEFAULT 'completed',
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE artifacts (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(140) NOT NULL UNIQUE,
  mission_id BIGINT UNSIGNED NOT NULL,
  celestial_body_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(150) NOT NULL,
  artifact_type VARCHAR(120) NOT NULL,
  call_sign VARCHAR(100),
  status ENUM('abandoned','active','lost','destroyed','unknown') DEFAULT 'abandoned',
  location_name VARCHAR(180),
  latitude DECIMAL(10,6),
  longitude DECIMAL(10,6),
  mass_kg DECIMAL(12,3),
  short_story TEXT,
  long_story LONGTEXT,
  FOREIGN KEY (mission_id) REFERENCES missions(id),
  FOREIGN KEY (celestial_body_id) REFERENCES celestial_bodies(id),
  INDEX idx_artifacts_body (celestial_body_id),
  INDEX idx_artifacts_mission (mission_id)
) ENGINE=InnoDB;

CREATE TABLE artifact_components (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  artifact_id BIGINT UNSIGNED NOT NULL,
  component_name VARCHAR(150) NOT NULL,
  fate VARCHAR(150),
  description TEXT,
  FOREIGN KEY (artifact_id) REFERENCES artifacts(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE crew (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(150) NOT NULL,
  role VARCHAR(120),
  bio TEXT
) ENGINE=InnoDB;

CREATE TABLE mission_crew (
  mission_id BIGINT UNSIGNED NOT NULL,
  crew_id BIGINT UNSIGNED NOT NULL,
  crew_role VARCHAR(120),
  PRIMARY KEY (mission_id, crew_id),
  FOREIGN KEY (mission_id) REFERENCES missions(id) ON DELETE CASCADE,
  FOREIGN KEY (crew_id) REFERENCES crew(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE timeline_events (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  mission_id BIGINT UNSIGNED,
  artifact_id BIGINT UNSIGNED,
  event_date DATE,
  event_time TIME NULL,
  title VARCHAR(180) NOT NULL,
  event_type VARCHAR(80),
  description TEXT,
  sort_order INT DEFAULT 0,
  FOREIGN KEY (mission_id) REFERENCES missions(id) ON DELETE SET NULL,
  FOREIGN KEY (artifact_id) REFERENCES artifacts(id) ON DELETE SET NULL,
  INDEX idx_timeline_artifact (artifact_id),
  INDEX idx_timeline_mission (mission_id)
) ENGINE=InnoDB;

CREATE TABLE media (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  artifact_id BIGINT UNSIGNED,
  mission_id BIGINT UNSIGNED,
  title VARCHAR(200) NOT NULL,
  media_type ENUM('photo','video','audio','document','map','dataset','3d_model') NOT NULL,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  credit VARCHAR(180),
  source_name VARCHAR(180),
  description TEXT,
  FOREIGN KEY (artifact_id) REFERENCES artifacts(id) ON DELETE CASCADE,
  FOREIGN KEY (mission_id) REFERENCES missions(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE sources (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  artifact_id BIGINT UNSIGNED,
  mission_id BIGINT UNSIGNED,
  source_type VARCHAR(80),
  title VARCHAR(220) NOT NULL,
  publisher VARCHAR(180),
  url TEXT NOT NULL,
  accessed_on DATE,
  note TEXT,
  FOREIGN KEY (artifact_id) REFERENCES artifacts(id) ON DELETE CASCADE,
  FOREIGN KEY (mission_id) REFERENCES missions(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE artifact_facts (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  artifact_id BIGINT UNSIGNED NOT NULL,
  fact_label VARCHAR(100) NOT NULL,
  fact_value VARCHAR(255) NOT NULL,
  sort_order INT DEFAULT 0,
  FOREIGN KEY (artifact_id) REFERENCES artifacts(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Core archive records
INSERT INTO celestial_bodies (slug, name, body_type, description)
VALUES
('moon','Moon','moon','Earth''s natural satellite and the first off-world destination reached by humans.'),
('mars','Mars','planet','Future archive — detailed collection not yet enabled.'),
('deep-space','Deep Space','deep_space','Future archive for objects beyond a single planetary surface.');

INSERT INTO missions (slug,name,program,launch_date,landing_date,return_date,description)
VALUES
('apollo-11','Apollo 11','Apollo Program','1969-07-16','1969-07-20','1969-07-24',
 'First crewed lunar landing mission.');

INSERT INTO crew (full_name,role,bio) VALUES
('Neil A. Armstrong','Commander','Apollo 11 commander and first human to step onto the lunar surface.'),
('Edwin E. Aldrin Jr.','Lunar Module Pilot','Apollo 11 lunar module pilot and second human to walk on the Moon.'),
('Michael Collins','Command Module Pilot','Apollo 11 command module pilot who remained in lunar orbit aboard Columbia.');

INSERT INTO mission_crew (mission_id,crew_id,crew_role)
SELECT m.id,c.id,'Commander' FROM missions m JOIN crew c ON c.full_name='Neil A. Armstrong' WHERE m.slug='apollo-11';
INSERT INTO mission_crew (mission_id,crew_id,crew_role)
SELECT m.id,c.id,'Lunar Module Pilot' FROM missions m JOIN crew c ON c.full_name='Edwin E. Aldrin Jr.' WHERE m.slug='apollo-11';
INSERT INTO mission_crew (mission_id,crew_id,crew_role)
SELECT m.id,c.id,'Command Module Pilot' FROM missions m JOIN crew c ON c.full_name='Michael Collins' WHERE m.slug='apollo-11';

INSERT INTO artifacts (
  slug, mission_id, celestial_body_id, name, artifact_type, call_sign, status,
  location_name, latitude, longitude, short_story, long_story
)
SELECT
  'apollo-11-eagle-descent-stage',
  m.id, b.id,
  'Eagle — Descent Stage',
  'Lunar Module Descent Stage',
  'Eagle',
  'abandoned',
  'Tranquility Base, Mare Tranquillitatis',
  0.674090, 23.472980,
  'The lower half of Apollo 11''s lunar module remained at Tranquility Base after its ascent stage carried Armstrong and Aldrin back to lunar orbit.',
  'Eagle carried Neil Armstrong and Edwin Buzz Aldrin from lunar orbit to the Sea of Tranquility on July 20, 1969. After surface operations, the ascent stage lifted away using the descent stage as its launch platform. The descent stage remained at Tranquility Base, preserving a physical trace of the first crewed lunar landing.'
FROM missions m JOIN celestial_bodies b ON b.slug='moon'
WHERE m.slug='apollo-11';

INSERT INTO artifact_components (artifact_id,component_name,fate,description)
SELECT id,'Descent stage','Remains on Moon','Lower stage and landing structure left at Tranquility Base.' FROM artifacts WHERE slug='apollo-11-eagle-descent-stage';

INSERT INTO artifact_components (artifact_id,component_name,fate,description)
SELECT id,'Ascent stage','Departed Moon','Carried Armstrong and Aldrin back to lunar orbit for rendezvous with Columbia.' FROM artifacts WHERE slug='apollo-11-eagle-descent-stage';

INSERT INTO artifact_facts (artifact_id,fact_label,fact_value,sort_order)
SELECT id,'Mission','Apollo 11',1 FROM artifacts WHERE slug='apollo-11-eagle-descent-stage';
INSERT INTO artifact_facts (artifact_id,fact_label,fact_value,sort_order)
SELECT id,'Module','LM-5',2 FROM artifacts WHERE slug='apollo-11-eagle-descent-stage';
INSERT INTO artifact_facts (artifact_id,fact_label,fact_value,sort_order)
SELECT id,'Landing site','Tranquility Base',3 FROM artifacts WHERE slug='apollo-11-eagle-descent-stage';
INSERT INTO artifact_facts (artifact_id,fact_label,fact_value,sort_order)
SELECT id,'Region','Mare Tranquillitatis',4 FROM artifacts WHERE slug='apollo-11-eagle-descent-stage';
INSERT INTO artifact_facts (artifact_id,fact_label,fact_value,sort_order)
SELECT id,'Landing date','1969-07-20',5 FROM artifacts WHERE slug='apollo-11-eagle-descent-stage';
INSERT INTO artifact_facts (artifact_id,fact_label,fact_value,sort_order)
SELECT id,'Status','Abandoned on Moon',6 FROM artifacts WHERE slug='apollo-11-eagle-descent-stage';

INSERT INTO timeline_events (mission_id,artifact_id,event_date,title,event_type,description,sort_order)
SELECT m.id,a.id,'1969-07-16','Launch','launch','Apollo 11 launches from Launch Complex 39A aboard Saturn V AS-506.',1
FROM missions m JOIN artifacts a ON a.mission_id=m.id WHERE m.slug='apollo-11';
INSERT INTO timeline_events (mission_id,artifact_id,event_date,title,event_type,description,sort_order)
SELECT m.id,a.id,'1969-07-19','Lunar orbit','orbit','Apollo 11 enters lunar orbit and prepares Eagle for descent.',2
FROM missions m JOIN artifacts a ON a.mission_id=m.id WHERE m.slug='apollo-11';
INSERT INTO timeline_events (mission_id,artifact_id,event_date,title,event_type,description,sort_order)
SELECT m.id,a.id,'1969-07-20','Eagle lands','landing','The lunar module lands in the Sea of Tranquility.',3
FROM missions m JOIN artifacts a ON a.mission_id=m.id WHERE m.slug='apollo-11';
INSERT INTO timeline_events (mission_id,artifact_id,event_date,title,event_type,description,sort_order)
SELECT m.id,a.id,'1969-07-20','First lunar EVA','surface','Armstrong and Aldrin perform the first human EVA on another world.',4
FROM missions m JOIN artifacts a ON a.mission_id=m.id WHERE m.slug='apollo-11';
INSERT INTO timeline_events (mission_id,artifact_id,event_date,title,event_type,description,sort_order)
SELECT m.id,a.id,'1969-07-21','Ascent stage departs','departure','The ascent stage lifts from the Moon and later rendezvous with Columbia.',5
FROM missions m JOIN artifacts a ON a.mission_id=m.id WHERE m.slug='apollo-11';
INSERT INTO timeline_events (mission_id,artifact_id,event_date,title,event_type,description,sort_order)
SELECT m.id,a.id,NULL,'Descent stage remains','legacy','The descent stage remains at Tranquility Base.',6
FROM missions m JOIN artifacts a ON a.mission_id=m.id WHERE m.slug='apollo-11';

INSERT INTO media (artifact_id,mission_id,title,media_type,url,credit,source_name,description)
SELECT a.id,m.id,'Apollo 11 Mission Page','document','https://www.nasa.gov/mission/apollo-11/','NASA','NASA','Mission photography, video and audio archive.'
FROM artifacts a JOIN missions m ON m.id=a.mission_id WHERE a.slug='apollo-11-eagle-descent-stage';
INSERT INTO media (artifact_id,mission_id,title,media_type,url,credit,source_name,description)
SELECT a.id,m.id,'Apollo 11 Landing Site From Dawn to Dusk','photo','https://science.nasa.gov/resource/apollo-11-landing-site-from-dawn-to-dusk/','NASA/GSFC/ASU','NASA Science','Lunar Reconnaissance Orbiter imagery of the landing site.'
FROM artifacts a JOIN missions m ON m.id=a.mission_id WHERE a.slug='apollo-11-eagle-descent-stage';
INSERT INTO media (artifact_id,mission_id,title,media_type,url,credit,source_name,description)
SELECT a.id,m.id,'Apollo 11 Mission Overview','document','https://www.nasa.gov/history/apollo-11-mission-overview/','NASA History','NASA','Historical mission record with milestones and spacecraft details.'
FROM artifacts a JOIN missions m ON m.id=a.mission_id WHERE a.slug='apollo-11-eagle-descent-stage';

INSERT INTO sources (artifact_id,mission_id,source_type,title,publisher,url,accessed_on,note)
SELECT a.id,m.id,'primary archive','Apollo 11 — NASA','NASA','https://www.nasa.gov/mission/apollo-11/',CURRENT_DATE,
'Official mission page with mission overview, photographs, video and audio resources.'
FROM artifacts a JOIN missions m ON m.id=a.mission_id WHERE a.slug='apollo-11-eagle-descent-stage';
INSERT INTO sources (artifact_id,mission_id,source_type,title,publisher,url,accessed_on,note)
SELECT a.id,m.id,'historical record','Apollo 11 Mission Overview','NASA History','https://www.nasa.gov/history/apollo-11-mission-overview/',CURRENT_DATE,
'Historical record with crew, LM-5, landing details and milestones.'
FROM artifacts a JOIN missions m ON m.id=a.mission_id WHERE a.slug='apollo-11-eagle-descent-stage';
INSERT INTO sources (artifact_id,mission_id,source_type,title,publisher,url,accessed_on,note)
SELECT a.id,m.id,'lunar imagery','Apollo 11 Landing Site From Dawn to Dusk','NASA / GSFC / ASU','https://science.nasa.gov/resource/apollo-11-landing-site-from-dawn-to-dusk/',CURRENT_DATE,
'LRO imagery showing the descent stage and astronaut tracks at the landing site.'
FROM artifacts a JOIN missions m ON m.id=a.mission_id WHERE a.slug='apollo-11-eagle-descent-stage';

-- Useful API/view examples:
CREATE OR REPLACE VIEW v_artifact_archive AS
SELECT
  a.id, a.slug, a.name, a.artifact_type, a.call_sign, a.status,
  b.name AS celestial_body, m.name AS mission, a.location_name,
  a.latitude, a.longitude, a.short_story
FROM artifacts a
JOIN celestial_bodies b ON b.id=a.celestial_body_id
JOIN missions m ON m.id=a.mission_id;
