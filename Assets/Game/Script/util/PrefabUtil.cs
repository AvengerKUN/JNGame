namespace Assets.Game.Script.util
{
    class PrefabUtil
    {
        ///// <summary>
        ///// 获取预制体资源路径。
        ///// </summary>
        ///// <param name="gameObject"></param>
        ///// <returns></returns>
        //public static string GetPrefabAssetPath(GameObject gameObject)
        //{
        //    // Project中的Prefab是Asset不是Instance
        //    if (PrefabUtility.IsPartOfPrefabAsset(gameObject))
        //    {
        //        // 预制体资源就是自身
        //        return AssetDatabase.GetAssetPath(gameObject);
        //    }

        //    // Scene中的Prefab Instance是Instance不是Asset
        //    if (PrefabUtility.IsPartOfPrefabInstance(gameObject))
        //    {
        //        // 获取预制体资源
        //        var prefabAsset = PrefabUtility.GetCorrespondingObjectFromOriginalSource(gameObject);
        //        return AssetDatabase.GetAssetPath(prefabAsset);
        //    }

        //    // PrefabMode中的GameObject既不是Instance也不是Asset
        //    var prefabStage = PrefabStageUtility.GetPrefabStage(gameObject);
        //    if (prefabStage != null)
        //    {
        //        // 预制体资源：prefabAsset = prefabStage.prefabContentsRoot
        //        return prefabStage.prefabAssetPath;
        //    }

        //    // 不是预制体
        //    return null;
        //}
    }
}
