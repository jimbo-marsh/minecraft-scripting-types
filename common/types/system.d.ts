/// <reference path="./view.d.ts" />
/// <reference path="./entity.d.ts" />

declare interface ISystem<TSystem> extends ISystemBase {
    /**
     * This is the first method that gets called immediately after the system is registered. It will run as soon as the script loads at world start.
     * You can use this to set up the environment for your script: register custom components and events, sign up event listeners, etc. This will run BEFORE the world is ready and the player has been added to it, so you shouldn't try to spawn any entities here!
     */
    initialize?(this: TSystem): void;

    /**
     * This method gets called once every game tick. The server aims to be 200 times per second, while client aims to be 60, 
     * but neither one is guaranteed and can vary with performance. This is a good place to get, check, and react to component changes.
     */
    update?(this: TSystem): void;

    /**
     * This method gets called when the Minecraft Script Engine is shutting down. For the client this is when they leave the world; for the server this is after the last player has exited the world.
     */
    shutdown?(this: TSystem): void;
}

declare interface ISystemBase {
    /**
     * Creates an entity and applies the specified template as defined in JSON. This allows you to quickly create an entity from the 
     * applied Behavior Packs as the base for an entity created in scripting. The entity will be spawned into the world with all the 
     * components, component groups, and event triggers that are defined in the JSON file of the identifier specified.
     * @param type Specifies the type of the entity that is being created by the template. Valid inputs are `entity` and `item_entity`
     * @param templateIdentifier This can be any of the entity identifiers from the applied Behavior Packs. For example specifying minecraft:cow here will make the provided entity a cow as defined in JSON
     */
    createEntity(type: EntityType, templateIdentifier: string): IEntityObject | null;

    /**
     * Allows you to register a view. A view will contain all entities that meet the filter requirement.
     * No filters are added by default when you register a view so it will capture all entities.
     */
    registerView(): IView;

    /**
     * 
     * @param spatialComponent Views are a way for you to filter for entities based on their components. Spatial views have an additional 
     * filtering system based on an area. Once you have registered a view, you can request all the entities that are captured by it. 
     * Views will only ever return entities that are currently active in the level. If your view extends into chunks that are not currently 
     * loaded, entities there will not be included in the view.
     * @param x_attribute This is the X axis value that will be used for the bounding box
     * @param y_attribute This is the Y axis value that will be used for the bounding box
     * @param z_attribute This is the Z axis value that will be used for the bounding box
     */
    registerSpatialView(spatialComponent: IViewPosition | any, x_attribute: string, y_attribute: string, z_attribute: string): ISpatialView;

    /**
     * By default no filters are added. This will allow views to capture all entities
     * @param ComponentName This is the identifier of the component that will be added to the filter list. Only entities that have that component will be listed in the view
     */
    addFilterToView(ComponentName: string): void;

    /**
     * User-Defined components are a special kind of component that can be defined in script and no built-in game system acts on it.
     * The component needs to be registered with the Script Engine by giving it a name and a set of fields in the format name:value. 
     * Once applied, the component behaves like any of the built-in components: you can get it from an entity, modify its values, and 
     * apply the changes.
     * Currently User-Defined components are the only components that can be dynamically added and removed from an entity using scripts. 
     * They don't need to be previously defined in an entity's JSON file. In the current version these components will NOT be saved out or 
     * loaded back in: they only exist while the entity is there and need to be added back when reloading the level.
     * @param componentIdentifier The name of the custom component. It is required to use a namespace so you can uniquely refer to it later without overlapping a name with a built-in component: for example 'myPack:myCustomComponent'
     * @param componentData A JavaScript Object that defines the name of the fields and the data each field holds inside the component.
     */
    registerComponent(componentIdentifier: string, componentData: object): any;

    /**
     * Applies the component and any changes made to it in script back to the entity. What this means for each component can be slightly 
     * different: it makes the component reload on the entity with the new data as if it had just been added to the entity.
     * @param component The component object retrieved from the entity that was returned by either createComponent() or getComponent()
     */
    applyComponentChanges(component: any): boolean | null;

    /**
     * Removes the specified component from the given entity. If the entity has the component, it will be removed. Currently this only works with custom components and can't be used to remove components defined for an entity in JSON.
     * @param entityObject The EntityObject that was retrieved from a call to createEntity() or retrieved from an event
     * @param componentIdentifier The name of the component to remove from the entity. This is either the name of a built-in component (check the Script Components section) or a custom component created with a call to registerComponent()
     */
    destroyComponent(entityObject: IEntityObject, componentIdentifier: string): boolean | null;

    /**
     * Allows you to fetch the entities captured by a view.
     * @param viewAllEntities This is the view you registered earlier using registerView()
     * @returns An array of IEntityObjects representing the entities found within the view
     */
    getEntitiesFromView(viewAllEntities: IView): IEntityObject[];

    /**
     * Allows you to fetch the entities captured by a spatial view.
     * @param spatialView This is the view you created earlier using registerSpatialView(...)
     * @param x0 The west limit of the filter area
     * @param y0 The bottom limit of the filter area
     * @param z0 The north limit of the filter area
     * @param x1 The east limit of the filter area
     * @param y1 The upper limit of the filter area
     * @param z1 The south limit of the filter area
     */
    getEntitiesFromSpatialView(spatialView: ISpatialView, x0: number, y0: number, z0: number, x1: number, y1: number, z1: number): IEntityObject[];

    /**
     * Creates an entity and applies the specified template as defined in JSON. This allows you to quickly create an entity from the 
     * applied Behavior Packs as the base for an entity created in scripting. The entity will be spawned into the world with all the 
     * components, component groups, and event triggers that are defined in the JSON file of the identifier specified.
     * @param type Specifies the type of the entity that is being created by the template. Valid inputs are `entity` and `item_entity`
     * @param templateIdentifier This can be any of the entity identifiers from the applied Behavior Packs. For example specifying minecraft:cow here will make the provided entity a cow as defined in JSON
     */
    createEntity(type: string, templateIdentifier: string): IEntityObject | null;

    /**
     * Destroys an entity identified by the EntityObject. If the entity exists in the world this will remove it from the world and 
     * destroy it. This also makes the EntityObject no longer valid - you should only destroy an entity after you are done with it and 
     * no longer need to reference it again. This does NOT kill the entity. There won't be an event for its death: it will be removed.
     * @param entity The IEntityObject that was retrieved from a call to createEntity() or retrieved from an event
     */
    destroyEntity(entity: IEntityObject): boolean | null;

    /**
     * Checks if the given EntityObject corresponds to a valid entity.
     * @param entity The EntityObject that was retrieved from a call to createEntity() or retrieved from an event
     */
    isValidEntity(entity: IEntityObject): boolean | null;
}