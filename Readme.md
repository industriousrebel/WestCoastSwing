Updated Idea: 
Initially just creating an app with Multiple users that can be used for Coaches and students to interact.
- [ ] Video upload function 
    - [ ] Take User email, user_id and append to video before loading to blob storage.
- [ ] Select Coach functions
    - [ ] SELECT DISTINCT name from users where role = 'coach'
- [ ] User Profile Page
    - [ ] User Profile Page name, level, 


DB Diagram.io  Schema.
Table users {
  id integer [primary key]
  username varchar // email
  name varchar
  wsdc_id varchar // WSDC ID
  level varchar // e.g., 'novice', 'intermediate', 'advanced', 'all star' , 'Champion'
  primary_role varchar // e.g., 'lead', 'follow'
  created_at timestamp
}

Table user_roles {
  id integer [primary key]
  user_id integer [not null]
  role varchar // e.g., 'coach', 'user'
  created_at timestamp
}

Table videos {
  id integer [primary key]
  user_id integer [not null] // the student
  coach_id integer [not null] // the coach reviewing
  storage_url varchar
  submitted_at timestamp
}

Table comments {
  id integer [primary key]
  video_id integer [not null]
  coach_id integer [not null]
  user_id integer [not null] // student
  comment text
  timestamp_start float
  timestamp_end float
  created_at timestamp
}

Table reviewed {
  id integer [primary key]
  user_id integer [not null] // student
  video_id integer [not null]
  status varchar // e.g., 'submitted', 'in_review', 'completed'
  reviewed_at timestamp
}

// Relationships

Ref: user_roles.user_id > users.id
Ref: videos.user_id > users.id
Ref: videos.coach_id > users.id
Ref: comments.video_id > videos.id
Ref: comments.coach_id > users.id
Ref: comments.user_id > users.id
Ref: reviewed.user_id > users.id
Ref: reviewed.video_id > videos.id


Enhancement:
- [ ] WCS footwork type (Triple, check step etc) 
- [ ] YOLO v2 to detect people and run separate Media Pipe on each person
- [x] Video Analysis Screen
- [x] Video Upload Function
- [ ] split_video/Audio Function
- [ ] Beat detector (Audio)
- [ ] Step_counter(video)
- [ ] combine function (steps: dict , beat: dict) *Time stamp comparison to confirm if landed on beat*

Got Idea 2.0 while chatting with friends:
This
Repo (https://github.com/Mruchus/dance-sync-analysis) + 
ft. Splitting video into Images ft. Removing secondary partner ft. mimic a pros dance that you want to emulate ft. remove their partner frame by frame ft. run dance sync analysis ft. a whole bunch of compute power. 