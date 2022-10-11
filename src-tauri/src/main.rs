#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::{SystemTray, SystemTrayMenu, SystemTrayEvent, Manager};

fn main() {
  let tray_menu = SystemTrayMenu::new();
  let system_tray = SystemTray::new().with_menu(tray_menu);
  tauri::Builder::default()
    .system_tray(system_tray)
    .on_system_tray_event(|app, event| match event {
          SystemTrayEvent::LeftClick {position: _,size: _,..} => {
            let window = app.get_window("main").unwrap();
            if window.is_visible().unwrap() {
                //window.show().unwrap();
                //window.set_focus().unwrap();
                //.unmaximize().unwrap();
                               // window.maximize().unwrap();
                               println!("yes");
            } else {
             //  window.show().unwrap();
            //  window.set_focus().unwrap();
               // window.unmaximize().unwrap();
              //  window.maximize().unwrap();
              println!("no");
            }
          }
          SystemTrayEvent::RightClick {
            position: _,
            size: _,
            ..
          } => {
            println!("system tray received a right click");
          }
          SystemTrayEvent::MenuItemClick { id, .. } => {
            match id.as_str() {
              "quit" => {
                std::process::exit(0);
              }
              "hide" => {
                let window = app.get_window("main").unwrap();
                window.hide().unwrap();
              }
              _ => {}
            }
          }
          _ => {}
        })
    .build(tauri::generate_context!())
    .expect("error while building tauri application")
    .run(|_app_handle, event| match event {
        tauri::RunEvent::ExitRequested { api, .. } => {
          api.prevent_exit();
        }
        _ => {}
      });
}
