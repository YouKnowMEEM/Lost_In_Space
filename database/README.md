# MySQL setup

1. Install MySQL 8+.
2. Run:

```sql
SOURCE /path/to/sleeping_beauties_mysql.sql;
```

3. Check:

```sql
USE sleeping_beauties;
SELECT * FROM v_artifact_archive;
```

The database is designed so each abandoned object is an `artifact`, linked to a `mission` and `celestial_body`. Media and sources are separate tables so one artifact can have many photographs, videos, audio clips, 3D models, maps and references.
